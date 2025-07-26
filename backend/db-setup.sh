#!/bin/sh
# Determine database provider
if [ "$NODE_ENV" = "codex" ]; then
  # Codex/local tests default to SQLite
  export DATABASE_PROVIDER=sqlite
  export DATABASE_URL=file:./dev.db
  rm -f prisma/dev.db
elif [ -f "/.dockerenv" ]; then
  # Always use Postgres inside Docker
  export DATABASE_PROVIDER=postgresql
  : ${DATABASE_URL:=postgresql://postgres:password@db:5432/ourglass}
elif command -v pg_isready >/dev/null 2>&1 && pg_isready -q -h localhost -p 5432; then
  # Local Postgres available
  export DATABASE_PROVIDER=postgresql
  : ${DATABASE_URL:=postgresql://postgres:password@localhost:5432/ourglass}
else
  # Fallback to SQLite
  export DATABASE_PROVIDER=sqlite
  export DATABASE_URL=file:./dev.db
  rm -f prisma/dev.db
fi
# Create temporary schema with fixed provider
TMP_SCHEMA="prisma/tmp.prisma"
sed "s/provider = env(\"DATABASE_PROVIDER\")/provider = \"$DATABASE_PROVIDER\"/" prisma/schema.prisma > "$TMP_SCHEMA"
# Run prisma commands
npx prisma generate --schema="$TMP_SCHEMA"
npx prisma migrate deploy --schema="$TMP_SCHEMA"
rm "$TMP_SCHEMA"
