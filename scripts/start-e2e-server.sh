#!/usr/bin/env bash
# Lance le serveur Next.js avec des variables Supabase factices (format valide)
# pour tester l'UI auth sans appeler un projet Supabase réel.
set -euo pipefail

export NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-https://e2e-test-project.supabase.co}"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9.abc123def456ghi789jkl012}"
export NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-http://127.0.0.1:3000}"
export PORT="${PORT:-3000}"

npm run start -- -p "$PORT"
