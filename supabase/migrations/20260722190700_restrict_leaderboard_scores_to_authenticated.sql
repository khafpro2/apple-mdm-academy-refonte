-- leaderboard_scores est SECURITY DEFINER (comportement par défaut des vues Postgres) et
-- contourne la RLS des tables sous-jacentes pour afficher le classement global.
-- On retire l'accès public (anon) : seuls les utilisateurs connectés voient le classement.
revoke all on public.leaderboard_scores from anon;
grant select on public.leaderboard_scores to authenticated;
