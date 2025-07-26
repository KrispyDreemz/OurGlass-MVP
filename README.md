# OurGlass-MVP

This project uses Prisma with support for both Postgres and SQLite. Postgres is used for production, Docker and CI pipelines while SQLite is used for local development, tests and Codex PR validation.

## Running Tests

`npm test` in the `backend` directory will automatically copy the correct environment file:

- In CI (`NODE_ENV=ci`), `.env.example` is used which points to Postgres.
- For Codex and local runs (`NODE_ENV=codex` or when no `.env` exists), `.env.test.example` is copied so tests run entirely against SQLite.

The `db-setup.sh` script detects the environment and configures Prisma accordingly. Inside Docker the script always uses Postgres. Locally and in Codex it defaults to SQLite unless a local Postgres instance is available.

## Docker

Docker and production environments require a running Postgres service. Use `docker-compose up` to build the stack.
