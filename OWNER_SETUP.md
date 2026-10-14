# Owner setup and launch notes

## Configure the JWT admin account

The admin dashboard uses email + password sign-in with a JWT session cookie. No external identity provider is involved.

Set these environment variables before starting the server:

- `ADMIN_EMAIL` — the administrator email used to sign in at `/admin`.
- `ADMIN_PASSWORD` — the administrator password (at least 8 characters).
- `JWT_SECRET` — a long random string used to sign session tokens. If it is missing the server falls back to an ephemeral secret and all sessions are invalidated on every restart; always set it in production.
- `DATABASE_URL` — Turso database URL (`libsql://…`) for hosted deployments, or a local SQLite file path (default `data/baata-pick.db`).
- `DATABASE_AUTH_TOKEN` — Turso auth token (only for remote `libsql://` databases).

On startup the server creates or refreshes the admin account from these values (scrypt-hashed password). Changing `ADMIN_PASSWORD` and restarting updates the password; clearing the variables disables admin sign-in for new sessions. Login attempts are rate-limited per IP.

## Claim the private dashboard

1. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `JWT_SECRET` (see above). The SQLite schema is created automatically on first server start.
2. Start the server and open `/admin`.
3. Sign in with the configured email and password.

## Database and data handling

This website stores registrations in a libSQL/Turso database through Drizzle. Local development uses a SQLite file (default `data/baata-pick.db`); hosted deployments should point `DATABASE_URL` at a Turso database so registrations persist. Pending migrations are applied automatically when the server starts. Back up the Turso database before running destructive schema changes.

The public forms are interest registrations only. They do not accept orders or payment. Driver application statuses track review progress and do not certify legal eligibility. Before public launch, add a real contact channel and review the privacy notice for the operator's legal identity and retention policy.
