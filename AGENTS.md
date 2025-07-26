# AGENTS.md – OurGlass Gallery MVP Agent Instructions

Deploy and operate the OurGlass MVP backend (Node.js + Express + Prisma + PostgreSQL) in Codex containers and local Docker without manual intervention. On startup, if `.env` is missing, copy `.env.example` to `.env` so `DATABASE_URL` is guaranteed. Start Postgres (`db`) first, wait until it is accepting connections, initialize the schema if needed, apply migrations, generate Prisma Client, and start the API. The platform must support user onboarding, two-phase auctions (sponsorship and ownership), sponsorship payouts, and 3.14% artist royalties on every resale.

Run the following process automatically at startup:
```bash
# Ensure environment exists
if [ ! -f .env ]; then cp .env.example .env; fi

# Start database first
docker compose up -d --build db

# Wait for Postgres readiness (retry every 3 seconds, max 10 attempts)
for i in {1..10}; do
  if docker compose exec db pg_isready -U ourglass; then break; fi
  sleep 3
done

# Initialize schema if database is empty
docker compose exec api npx prisma migrate dev --name init_auction_system || true

# Apply existing migrations and regenerate Prisma Client
docker compose exec api npx prisma migrate deploy
docker compose exec api npx prisma generate

# Start API container
docker compose up -d --build api

Recovery:

    If Prisma throws P1012 (missing DATABASE_URL), ensure .env exists or copy it from .env.example.

    If Postgres connection issues persist, restart db and rerun the migration and generation commands.

    If migrations fail, run:

    docker compose exec api npx prisma migrate dev --name init_auction_system
    docker compose exec api npx prisma generate

Codex agents must ensure this sequence runs so the backend starts cleanly with a ready database, all migrations applied, and API online for automated tests and marketplace features to run end-to-end.