# AGENTS.md – OurGlass Gallery MVP Agent Instructions (Auto-Setup)

Deploy and operate the OurGlass MVP backend (Node.js + Express + Prisma + PostgreSQL) in Codex containers and local Docker without manual intervention. Codex must guarantee a valid `DATABASE_URL`, ensure Postgres (`db`) is running before Prisma commands, initialize the schema if fresh, apply migrations, regenerate Prisma Client, and start the API.

At container startup, always execute:
```bash
# Ensure environment variables are present
if [ ! -f .env ]; then cp .env.example .env; fi

# Start database container
docker compose up -d --build db

# Wait for Postgres to become ready (retry up to 10 times, 3-second delay)
for i in {1..10}; do
  if docker compose exec db pg_isready -U ourglass; then break; fi
  sleep 3
done

# Initialize schema if database is empty (safe to run even if already migrated)
docker compose exec api npx prisma migrate dev --name init_auction_system || true

# Apply existing migrations and regenerate Prisma client
docker compose exec api npx prisma migrate deploy
docker compose exec api npx prisma generate

# Start API service
docker compose up -d --build api

Recovery:

    If Prisma fails with P1012 (missing DATABASE_URL), verify .env exists or recreate it from .env.example.

    If Postgres connection errors occur, restart db and rerun the migration and generation commands.

    If migrations are out of sync, rerun:

docker compose exec api npx prisma migrate dev --name init_auction_system
docker compose exec api npx prisma generate