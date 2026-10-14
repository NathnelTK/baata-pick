# Mela — Ethiopia Delivery Network: implementation plan

## Product scope and architecture

Build an English-language, mobile-first pre-launch website for a delivery network intended to serve Addis Ababa, other Ethiopian cities, small towns, and rural kebeles. It is a demand-validation and registration product—not a live ordering, tracking, payment, or dispatch system.

The approved product behavior includes a public launch landing page; passwordless customer waitlist; driver and business interest forms; a private owner dashboard with location-based demand views and driver-application statuses; privacy language and server-side validation; and durable storage of submissions. Use the initialized Manus WebDev project and its React, TypeScript, Tailwind, Express/tRPC, Drizzle, and Manus OAuth starter. Extend the existing users table, add application tables and deterministic Drizzle migrations, expose validated tRPC operations, and connect them to responsive, accessible forms and admin views. All admin operations use the existing authenticated-user and `adminProcedure` checks. Since OAuth does not expose a trusted project-owner role and no owner identity was preconfigured, a high-entropy protected setup code is configured in the project's secret store. The first authenticated user who presents this code claims the sole owner-admin role through an atomic, permanent database claim; the same code can never authorize another admin.

Use an honest launch contact note: no public phone number or email was supplied, so show that a public support line is not yet available and route prospective partners to the registration forms rather than inventing contact details.

### Persistence constraint and adaptation

The source brief recommends Angular, ASP.NET Core, SQLite, and Entity Framework Core. The initialized project supplies React/Express/Drizzle, and this Manus deployment provides a persistent managed MySQL-compatible database; container file storage is temporary. A SQLite database stored in the container would not satisfy the requested durability requirement. Therefore, implement equivalent durable registration behavior using the provisioned managed database and schema/migrations, and keep the model portable enough to migrate later. Do not describe this delivery as using SQLite or Entity Framework Core. Exact deployment with the recommended .NET/SQLite stack would require a host with durable SQLite storage or an external persistent database not currently configured.

Supporting-document uploads, customer passwords, SMS verification, automated notifications, delivery tracking, checkout, or a full order flow are excluded from this release. Driver status describes application progress only, not legal clearance.

## Project structure

- `client/src/pages/Home.tsx`: public story, service explanation, coverage, role-specific calls to action, FAQ, and launch/contact note.
- `client/src/pages/Registration.tsx`: shared registration shell and customer, driver, and business forms with browser and server validation and generic-safe completion states.
- `client/src/pages/Admin.tsx`: owner-authenticated dashboard, one-time first-owner claim, area demand, registration views, filters, and driver-status workflow.
- `client/src/pages/Privacy.tsx`: plain-language collection, use, access, and protection notice.
- `client/src/components/SiteChrome.tsx`: custom route-pin identity, accessible responsive navigation, and footer.
- `client/src/App.tsx` and `client/public/manus-routes.json`: client routes and a source-synchronized route manifest.
- `client/src/index.css`: brand tokens, typography, responsive layout, reduced-motion and keyboard-focus styles.
- `client/public/assets/`: purpose-made Ethiopia delivery-network hero artwork; `client/public/mela-logo.svg`: original brand mark.
- `server/routers.ts`: public registration procedures, timing-safe one-time admin claim, and owner-protected dashboard procedures.
- `server/db.ts`: typed persistence, duplicate-safe record insertion, filtered review queries, aggregates, atomic owner claim, and driver status updates.
- `server/registrationRateLimit.ts`: transient per-process spam friction; request addresses are not persisted.
- `drizzle/schema.ts` and `drizzle/`: customer, driver application, business application, user-role, and single-owner-claim models plus migrations; phone numbers remain strings.
- `plan.md`, `TODO.md`, and `OWNER_SETUP.md`: design/implementation rationale, outcome requirements, and owner activation notes.

## Design direction

- **Design Movement:** contemporary East African editorial wayfinding—grounded in local landscapes and everyday routes, with the precision of a modern civic service.
- **Core Principles:** nationwide inclusion beyond the capital; practical trust and legible forms; warm human scale; progressive clarity about pre-launch limitations.
- **Color Philosophy:** deep highland-forest ink communicates reliability; warm ivory keeps long forms comfortable; an ownable burnt-clay route color brings energy and a visual link to earth roads; restrained brass/sunlight notes signal optimism. Muted greens support data and status but never act as the only status cue.
- **Layout Paradigm:** an asymmetric editorial split hero with headline and route/landscape visual, alternating open text-and-image sections, a horizontal annotated journey strip, and cards used only to distinguish the three audiences. Avoid a generic centered grid.
- **Signature Elements:** fine dotted courier routes with waypoint dots; a custom M-shaped route-pin brand mark; small region/area chips and hand-drawn contour/road curves.
- **Interaction Philosophy:** clear, reassuring, low-bandwidth-friendly actions; relevant form fields only; readable controls, explicit errors, keyboard focus, and honest confirmation. No simulated live tracking or unsupported service availability.
- **Animation:** short 160–260 ms opacity/transform transitions; a single gentle route-line reveal in the hero; restrained waypoint motion only when permitted; honor `prefers-reduced-motion` and never delay form use.
- **Typography System:** Fraunces for display headlines paired with DM Sans for readable UI/body text, with system fallbacks. Use bold compact headings, 16–18 px body copy, and large touch targets.
- **Brand Essence:** “A delivery network built to connect everyday needs across Ethiopia—not just the capital.” Personality: **grounded, dependable, hopeful**.
- **Brand Voice:** candid, warm, locally resonant, never overpromising. Examples: “From the city street to the village road.” “We’re getting ready to deliver. Tell us where to begin.”
- **Wordmark & Logo:** a small route-pin emblem whose curved road draws an M and ends at a waypoint; pair with the Mela wordmark in Fraunces, not a default icon or generated lettering.
- **Signature Brand Color:** burnt clay `#C95A3E`.

## Serving and platform dependencies

Use the initialized Manus-managed server and persistent database capabilities. Public registration remains passwordless; the dashboard uses real Manus OAuth and application-role checks. The first owner claim uses the protected project secret `MELA_ADMIN_BOOTSTRAP_TOKEN`; its single-use claim row is stored in the managed database. Validate input on both client and server, store phone numbers as strings, use a honeypot, minimum completion time and transient rate limiting for basic spam resistance, and return identical duplicate-safe success responses. Keep migrations additive. Use only relative browser URLs for public Preview compatibility. Keep `/manus-routes.json` aligned with `/`, `/register/:kind`, `/admin`, and `/privacy`.
