# Mela website delivery outcomes

## Public pre-launch landing page
- Provide a public landing page that introduces the company and mission, explains how the future delivery service will work, identifies intended service areas across Addis Ababa, other Ethiopian cities, small towns, and villages, and clearly states that the service is preparing to launch.
- Provide clear calls to action to register as a customer, driver, or business.
- Include FAQs and contact information. No public phone or email was supplied, so state that a public support line is not available yet and direct prospective users to the relevant registration form; do not invent contact details.
- Make navigation and content usable on phones and computers with accessible labels, focus states, and responsive layouts.

## Customer waitlist registration
- Let customers register without creating an account or password; the registration is a waitlist, not a delivery-ordering system.
- Collect full name, phone number, region, zone, woreda, kebele, preferred delivery service, expected delivery frequency, and optional email.
- Validate input, persist valid submissions, protect personal information, provide a clear success response, and avoid revealing whether a particular phone number is already registered.

## Driver application
- Collect full name and phone number; region and preferred operating area; vehicle type and ownership status; driving or delivery experience; relevant driving-license details; availability; confirmation that the information is accurate; and consent to the privacy notice.
- Do not require a customer account or collect supporting-document uploads in this initial flow.
- Save valid applications for manual review. Allow the owner to mark applications Pending, Under Review, Approved, or Rejected. Explain that these statuses indicate application progress, not a guarantee that a driver is legally cleared to operate.

## Business partnership registration
- Let shops and other businesses register interest in using or partnering with the delivery service.
- Collect business name, contact person's name and phone number, business category, business location, products or services delivered, and expected delivery needs.
- Validate input, persist valid submissions, protect personal information, and provide clear completion feedback.

## Private owner dashboard and demand analysis
- Require real authentication and authorization for all dashboard data and administrative operations; do not expose private registrations to public routes or unauthenticated users.
- Show registration counts and compare customer demand by area; allow the owner to view customer waitlist entries and filter by location.
- Allow the owner to view driver applications and update their status among Pending, Under Review, Approved, and Rejected.
- Allow the owner to view business applications and their needs.
- Treat driver application status as workflow progress only, not legal clearance.

## Durable registration data and privacy
- Persist customers, driver applications, and business applications in a durable database; keep telephone numbers as strings to preserve country codes and leading zeros.
- Validate public input on the server, apply basic spam protection, collect consent where specified, and avoid disclosing duplicate-phone status.
- Provide a privacy notice that explains what information is collected and why.
- The initialized Manus deployment provides a persistent managed MySQL-compatible database and temporary container filesystems. Use the managed database for durability; do not claim that the deployment uses SQLite or Entity Framework Core. Supporting documents, SMS verification, automated notifications, delivery tracking, and full ordering are outside this initial release.
