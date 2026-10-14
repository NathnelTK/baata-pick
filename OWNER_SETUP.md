# Owner setup and launch notes

## Claim the private dashboard

1. Open the Mela website and visit `/admin`.
2. Sign in with your own Manus account using the real OAuth flow.
3. On the first-owner setup screen, enter the one-time code you created in the secure project secret card for `MELA_ADMIN_BOOTSTRAP_TOKEN`.
4. The first successful claim permanently grants that signed-in account the admin role and records the claim in the database. The code cannot be used to grant any other account admin access. Keep it private and delete or rotate the secret only after the claim is complete; never commit or share it in source code.

The secret should be scoped to **All environments**, as selected in the protected setup card, so it is available on Preview and the deployed website. The first admin claim is single-use across environments because development and publication share the project database.

## Database and data handling

This website uses the project's persistent managed MySQL-compatible database through Drizzle. The platform's container filesystem is temporary, so this is more durable than a SQLite file in the deployed container. The implementation does not claim to use SQLite or Entity Framework Core. The project's `drizzle/schema.ts` and additive migration files define the registration tables. Development and published versions share the managed database: do not submit test registrations to a real launch database, and do not run destructive migrations without a backup and approval.

The public forms are interest registrations only. They do not accept orders or payment. Driver application statuses track review progress and do not certify legal eligibility. Before public launch, add a real contact channel and review the privacy notice for the operator's legal identity and retention policy.
