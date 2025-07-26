# AGENTS.md – OurGlass Gallery MVP Agent Instructions

Deploy and operate the OurGlass MVP backend (Node.js + Express + Prisma + PostgreSQL) in Codex containers and local Docker without manual intervention. Codex must guarantee a valid `DATABASE_URL`, ensure Postgres (`db`) is running before Prisma commands, initialize the schema if fresh, apply migrations, regenerate Prisma Client, and start the API.

At the **very start of any container run**, Codex must:
```bash
# Ensure environment variables exist before npm or Prisma runs
if [ ! -f .env ]; then cp .env.example .env; fi

Then run the startup sequence:

# Start database container
docker compose up -d --build db

# Wait for Postgres to be ready (retry up to 10 times, 3-second delay)
for i in {1..10}; do
  if docker compose exec db pg_isready -U ourglass; then break; fi
  sleep 3
done

# Initialize schema if the database is empty (safe to run on every startup)
docker compose exec api npx prisma migrate dev --name init_auction_system || true

# Apply migrations and regenerate Prisma client
docker compose exec api npx prisma migrate deploy
docker compose exec api npx prisma generate

# Start API service
docker compose up -d --build api

Recovery:

    If Prisma fails with P1012 (missing DATABASE_URL), ensure .env exists or copy from .env.example.

    If Postgres connection issues occur, restart db and rerun migration commands.

    If schema drift is detected, rerun:

docker compose exec api npx prisma migrate dev --name init_auction_system
docker compose exec api npx prisma generate