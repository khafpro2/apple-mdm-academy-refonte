-- ============================================================
-- Apple MDM Academy — Migration V2
-- Tables: contact_requests, user_achievements, progression_history
-- ============================================================

-- ── contact_requests ─────────────────────────────────────────────────────────
create table if not exists public.contact_requests (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) >= 2 and char_length(name) <= 200),
  email       text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  subject     text not null default 'Question générale',
  message     text not null check (char_length(message) >= 10 and char_length(message) <= 5000),
  ip_hash     text,           -- hashed IP for rate limiting audit (never plain IP)
  email_sent  boolean default false,
  created_at  timestamptz not null default now()
);

-- RLS: insert public, read admin only
alter table public.contact_requests enable row level security;

create policy "anyone can insert contact request"
  on public.contact_requests for insert
  with check (true);

create policy "admin can read contact requests"
  on public.contact_requests for select
  using (
    auth.jwt() ->> 'email' = any(
      string_to_array(current_setting('app.admin_emails', true), ',')
    )
  );

-- Index pour éviter spam (recherche rapide par email + date)
create index if not exists idx_contact_requests_email_created
  on public.contact_requests(email, created_at desc);

-- ── user_achievements ─────────────────────────────────────────────────────────
create table if not exists public.user_achievements (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  badge_id      text not null,               -- slug du badge (ex: "jamf-100-first-pass")
  badge_title   text not null,
  badge_icon    text,                        -- emoji ou URL icône
  earned_at     timestamptz not null default now(),
  quiz_slug     text,                        -- examen qui a déclenché le badge (optionnel)
  score_percent integer check (score_percent between 0 and 100),
  unique(user_id, badge_id)                  -- un badge une seule fois par utilisateur
);

alter table public.user_achievements enable row level security;

create policy "users read their own achievements"
  on public.user_achievements for select
  using (auth.uid() = user_id);

create policy "service role inserts achievements"
  on public.user_achievements for insert
  with check (auth.uid() = user_id);

create index if not exists idx_user_achievements_user
  on public.user_achievements(user_id, earned_at desc);

-- ── progression_history ───────────────────────────────────────────────────────
-- Enregistre l'évolution du score global dans le temps (pour le graphique)
create table if not exists public.progression_history (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  global_percent integer not null check (global_percent between 0 and 100),
  snapshot_date date not null default current_date,
  details       jsonb,   -- { courses: {...}, exams: {...} } snapshot optionnel
  unique(user_id, snapshot_date)   -- un snapshot par jour
);

alter table public.progression_history enable row level security;

create policy "users read their own history"
  on public.progression_history for select
  using (auth.uid() = user_id);

create policy "users insert their own history"
  on public.progression_history for insert
  with check (auth.uid() = user_id);

create policy "users update their own history"
  on public.progression_history for update
  using (auth.uid() = user_id);

create index if not exists idx_progression_history_user_date
  on public.progression_history(user_id, snapshot_date desc);

-- ── Fonction helper: upsert progression quotidienne ──────────────────────────
create or replace function public.upsert_daily_progression(
  p_user_id uuid,
  p_percent integer
) returns void
language plpgsql security definer as $$
begin
  insert into public.progression_history(user_id, global_percent, snapshot_date)
  values (p_user_id, p_percent, current_date)
  on conflict (user_id, snapshot_date)
  do update set global_percent = excluded.global_percent;
end;
$$;

-- Grant execute to authenticated users
grant execute on function public.upsert_daily_progression to authenticated;

comment on table public.contact_requests     is 'Formulaires de contact Apple MDM Academy';
comment on table public.user_achievements    is 'Badges et certifications obtenus par les apprenants';
comment on table public.progression_history  is 'Historique de progression globale (1 snapshot/jour)';
