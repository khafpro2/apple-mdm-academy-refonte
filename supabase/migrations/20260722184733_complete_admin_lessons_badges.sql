-- Migration : complète le schéma manquant en base (jamais appliqué au-delà de schema.sql partiel)
-- Consolide supabase/schema-admin.sql et supabase/schema-phase2.sql, + user_badges (schema.sql, jamais créée)

-- ── user_badges (définie dans schema.sql mais absente en base) ──────────────
create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id text not null,
  earned_at timestamptz default now(),
  unique (user_id, badge_id)
);

alter table public.user_badges enable row level security;

drop policy if exists "Users view own badges" on public.user_badges;
create policy "Users view own badges"
  on public.user_badges for select
  using (auth.uid() = user_id);

drop policy if exists "Users earn badges" on public.user_badges;
create policy "Users earn badges"
  on public.user_badges for insert
  with check (auth.uid() = user_id);

-- ── Admin (supabase/schema-admin.sql) ───────────────────────────────────────
alter table public.profiles
  add column if not exists is_admin boolean not null default false;

create table if not exists public.admin_allowlist (
  email text primary key,
  created_at timestamptz default now()
);

alter table public.admin_allowlist enable row level security;

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

-- ── Phase 2 (supabase/schema-phase2.sql) ────────────────────────────────────
alter table public.quiz_results
  add column if not exists duration_seconds integer,
  add column if not exists exam_mode boolean default false;

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_slug text not null,
  course_slug text not null default 'intune-mac',
  score integer default 0 check (score >= 0 and score <= 100),
  completed_at timestamptz default now(),
  unique (user_id, lesson_slug)
);

alter table public.lesson_progress enable row level security;

drop policy if exists "Users manage own lesson progress" on public.lesson_progress;
create policy "Users manage own lesson progress"
  on public.lesson_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_slug text,
  quiz_slug text,
  duration_seconds integer not null default 0,
  recorded_at timestamptz default now()
);

alter table public.study_sessions enable row level security;

drop policy if exists "Users manage own study sessions" on public.study_sessions;
create policy "Users manage own study sessions"
  on public.study_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace view public.leaderboard_scores as
select
  p.id as user_id,
  coalesce(p.full_name, 'Apprenant') as display_name,
  count(distinct lp.lesson_slug) filter (where lp.completed_at is not null) as modules_completed,
  round(avg(qr.score)::numeric, 0)::integer as avg_score,
  max(qr.score) as best_score,
  min(qr.duration_seconds) filter (where qr.passed and qr.duration_seconds > 0) as fastest_exam_seconds
from public.profiles p
left join public.lesson_progress lp on lp.user_id = p.id
left join public.quiz_results qr on qr.user_id = p.id
group by p.id, p.full_name;

drop policy if exists "Admins read all lesson progress" on public.lesson_progress;
create policy "Admins read all lesson progress"
  on public.lesson_progress for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );
