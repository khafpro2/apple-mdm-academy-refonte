-- Migration admin — exécuter après schema.sql
-- https://supabase.com/dashboard/project/_/sql

-- Colonne admin sur les profils
alter table public.profiles
  add column if not exists is_admin boolean not null default false;

-- Fonction helper RLS
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
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
-- update public.profiles set is_admin = true
-- where id = (select id from auth.users where email = 'votre@email.fr');
