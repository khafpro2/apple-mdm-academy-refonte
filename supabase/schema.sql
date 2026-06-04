-- Apple MDM Academy — Schéma Supabase
-- Exécuter dans Supabase SQL Editor : https://supabase.com/dashboard/project/_/sql

-- Profils utilisateurs (lié à auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-création du profil à l'inscription
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do update
    set full_name = coalesce(excluded.full_name, public.profiles.full_name),
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Progression par parcours
create table if not exists public.track_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  track_slug text not null,
  percent integer default 0 check (percent >= 0 and percent <= 100),
  updated_at timestamptz default now(),
  unique (user_id, track_slug)
);

alter table public.track_progress enable row level security;

drop policy if exists "Users manage own progress" on public.track_progress;
create policy "Users manage own progress"
  on public.track_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Résultats quiz
create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quiz_slug text not null,
  score integer not null,
  passed boolean not null,
  answers jsonb,
  completed_at timestamptz default now()
);

alter table public.quiz_results enable row level security;

drop policy if exists "Users manage own quiz results" on public.quiz_results;
create policy "Users manage own quiz results"
  on public.quiz_results for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Badges
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
