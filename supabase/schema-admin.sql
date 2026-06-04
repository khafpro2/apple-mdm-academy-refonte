-- Migration admin — exécuter après schema.sql
-- https://supabase.com/dashboard/project/_/sql

-- Colonne admin sur les profils
alter table public.profiles
  add column if not exists is_admin boolean not null default false;

-- Liste d'emails admin (source de vérité RLS — aligner avec ADMIN_EMAILS côté Vercel)
create table if not exists public.admin_allowlist (
  email text primary key,
  created_at timestamptz default now()
);

alter table public.admin_allowlist enable row level security;

-- Synchronise is_admin depuis admin_allowlist (appelé côté serveur avant les requêtes admin)
create or replace function public.sync_admin_from_allowlist()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    return;
  end if;

  update public.profiles p
  set is_admin = true,
      updated_at = now()
  from auth.users u
  inner join public.admin_allowlist a on lower(u.email) = lower(a.email)
  where p.id = u.id
    and u.id = auth.uid();
end;
$$;

revoke all on function public.sync_admin_from_allowlist() from public;
grant execute on function public.sync_admin_from_allowlist() to authenticated;

-- Fonction helper RLS
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select coalesce(
    (select p.is_admin from public.profiles p where p.id = auth.uid()),
    false
  )
  or exists (
    select 1
    from auth.users u
    inner join public.admin_allowlist a on lower(u.email) = lower(a.email)
    where u.id = auth.uid()
  );
$$;

-- Policies admin (lecture globale)
drop policy if exists "Admins read all profiles" on public.profiles;
create policy "Admins read all profiles"
  on public.profiles for select
  using (public.is_admin() or auth.uid() = id);

drop policy if exists "Admins read all quiz results" on public.quiz_results;
create policy "Admins read all quiz results"
  on public.quiz_results for select
  using (public.is_admin() or auth.uid() = user_id);

drop policy if exists "Admins read all track progress" on public.track_progress;
create policy "Admins read all track progress"
  on public.track_progress for select
  using (public.is_admin() or auth.uid() = user_id);

drop policy if exists "Admins read all badges" on public.user_badges;
create policy "Admins read all badges"
  on public.user_badges for select
  using (public.is_admin() or auth.uid() = user_id);

-- Exemple : promouvoir un admin (remplacez l'email)
-- insert into public.admin_allowlist (email) values ('votre@email.fr')
-- on conflict (email) do nothing;
-- select public.sync_admin_from_allowlist(); -- depuis une session authentifiée admin

-- Alternative directe :
-- update public.profiles set is_admin = true
-- where id = (select id from auth.users where email = 'votre@email.fr');
