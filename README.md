# BAATA PICK — Ethiopia Delivery Network

Pre-launch registration website: customers join a waitlist, drivers and businesses apply, and the owner reviews everything in a private JWT-protected dashboard.

## Stack

- React + Vite frontend (`client/`), Express + tRPC backend (`server/`), shared types (`shared/`).
- SQLite database (better-sqlite3) through Drizzle ORM. Migrations live in `drizzle/` and are applied automatically on server start.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | SQLite file path (default `data/baata-pick.db`). Accepts plain paths or `sqlite://` URLs. |
| `ADMIN_EMAIL` | Administrator email used to sign in at `/admin`. |
| `ADMIN_PASSWORD` | Administrator password (min 8 characters); seeded/refreshed at startup. |
| `JWT_SECRET` | Long random string used to sign admin session JWTs. Required in production. |
| `PORT` | Server port (default 3000). |

## Commands

- `pnpm dev`: development server; honors `PORT` (default 3000).
- `pnpm build` / `pnpm start`: build and serve `dist/index.js` and `dist/public/`.
- `pnpm db:generate` / `pnpm db:migrate`: generate or apply drizzle migrations (the server also applies pending migrations on start).
- `pnpm check` / `pnpm test`: types and application tests.

## Admin

Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `JWT_SECRET`, start the server, and sign in at `/admin`. See `OWNER_SETUP.md` for details.
