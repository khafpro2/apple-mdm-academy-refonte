-- Apple MDM Academy — Phase 2 (exécuter après schema.sql + schema-admin.sql)

-- Durée et mode examen sur les résultats quiz
alter table public.quiz_results
  add column if not exists duration_seconds integer,
  add column if not exists exam_mode boolean default false;

-- Progression par leçon (modules premium)
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

-- Temps d'étude cumulé (secondes)
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

-- Leaderboard : lecture publique des scores agrégés (profiles + quiz_results)
-- Les requêtes leaderboard utilisent les policies existantes via RPC admin ou vue

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

-- Admins peuvent lire la vue leaderboard
drop policy if exists "Admins read all lesson progress" on public.lesson_progress;
create policy "Admins read all lesson progress"
  on public.lesson_progress for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );
