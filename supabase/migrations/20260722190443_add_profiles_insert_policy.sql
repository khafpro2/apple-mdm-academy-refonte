-- profiles.insert policy manquante (prévue dans schema.sql mais jamais appliquée)
-- Sécurise le fallback INSERT de ensureUserProfile() si le trigger handle_new_user
-- n'a pas encore créé la ligne (ex: course entre le insert auth.users et le premier appel client).
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);
