# BAATA PICK — Ethiopia Delivery Network

Pre-launch registration website: customers join a waitlist, drivers and businesses apply, and the owner reviews everything in a private JWT-protected dashboard.

## Stack

- React + Vite frontend (`client/`), Express + tRPC backend (`server/`), shared types (`shared/`).
- libSQL/Turso database through Drizzle ORM. Migrations live in `drizzle/` and are applied automatically on server start. Local development uses a SQLite file; hosted deployments use Turso (`libsql://`).

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Turso database URL (`libsql://…`) or a local SQLite file path (default `data/baata-pick.db`). Required on Vercel. |
| `DATABASE_AUTH_TOKEN` | Turso auth token (only needed for remote `libsql://` databases). |
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

## Deploying to Vercel

- `vercel.json` builds with `pnpm build`, serves `dist/public` as the static frontend, and routes `/api/*` to the serverless function in `api/index.ts` (shared Express app in `server/app.ts`).
- Set the project environment variables in Vercel (**Settings > Environment Variables**): `DATABASE_URL` (Turso `libsql://…`), `DATABASE_AUTH_TOKEN`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET`. The database schema and the admin account are created automatically on the first serverless request.
- Registrations persist in the Turso database across deployments and serverless instances.
