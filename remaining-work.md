# Remaining Work: Production Readiness

This document tracks what is still required to make OddFinds production-ready and ensure all major features work reliably end-to-end.

## 1) Critical Product Gaps (What Is Still Missing)

### Authentication & Authorization
- Login flow is effectively bypassed in app UI routes.
- Middleware route protection is not active for admin/user areas.
- Registration and session-based sign-in are not fully integrated.
- Role enforcement is not consistently applied across backend endpoints.

### Commerce Core (Cart, Checkout, Orders, Payments)
- Checkout totals are not fully driven by live cart state in all paths.
- Payment lifecycle is incomplete (authorization, capture, failure, retries, reconciliation).
- Webhook handlers are placeholder-level and need robust verification and state updates.
- Orders are not a single source of truth across user/admin/storefront flows.
- User order history and tracking pages still rely on static/sample behavior in places.

### Admin Data Durability
- Multiple admin sections still rely on runtime/in-memory state instead of durable DB persistence:
  - Customers
  - Discounts
  - Delivery assignments
  - Review moderation queue
  - Settings
  - Email automation toggles
  - AI agent registry toggles

### Procurement (Finder -> Availability -> Supplier -> Negotiation)
- Product sourcing flow is partially simulated/local-storage backed.
- Supplier discovery is heuristic + scrape-fallback, not guaranteed deterministic.
- Negotiation is simulation + draft generation, not real authenticated seller messaging.
- No persistent, auditable negotiation thread system in backend DB yet.

### Catalog & Merchandising
- Some taxonomy/config areas are still static (categories/deals behavior in parts of app).
- Need admin-driven controls for merchandising and category governance end-to-end.

### Media Upload & Content Safety
- Upload-to-S3 exists, but production hardening is incomplete:
  - Auth guard on upload route
  - Malware/content scanning pipeline
  - File moderation / abuse controls
  - Quotas and rate controls
  - Signed upload strategy and least-privilege IAM

### Security, Reliability, and Operations
- Validation/authz hardening is incomplete on many API routes.
- In-memory rate limiting is not suitable for multi-instance production.
- Job/queue infra is scaffolded but not wired to real workers for critical tasks.
- Observability is minimal (structured logs, metrics, tracing, alerting not complete).
- No automated test coverage and no CI gate enforcing quality.

---

## 2) What Is Needed From You (Access, Keys, Data, Decisions)

### Infrastructure & Deployment
- Staging + production platform access (where app and backend will run).
- Permission to configure environment variables/secrets in those environments.
- Domain and DNS access (or owner availability for quick changes).
- Secure secret-sharing channel (vault/password manager), not chat.

### Database
- MongoDB Atlas credentials/URIs for staging and production.
- DB names and cluster-level access scope.
- Network allowlist/VPC decisions and final security posture.

### Authentication
- Final auth strategy decision (Credentials, Google OAuth, or both).
- Production values for:
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL`
  - OAuth client IDs/secrets
- List of admin users/emails and role policy.

### Payments
- Razorpay live key/secret + webhook secret.
- Stripe live key/secret + webhook secret.
- Payment business rules:
  - COD policy
  - refund rules
  - cancellation/retry behavior
  - failed payment recovery rules

### Shipping & Fulfillment
- Shiprocket/Delhivery (or chosen carrier) API credentials.
- Webhook credentials and callback URLs.
- Warehouse origin, zones, SLAs, and serviceability rules.

### Email/Notifications
- SMTP/provider credentials.
- Verified sender identity.
- SPF, DKIM, DMARC setup status.
- Approved transactional templates and sending policy.

### Media Storage
- AWS S3 final configuration:
  - bucket
  - region
  - IAM user/role with least privilege
  - bucket CORS and public/private strategy
  - lifecycle/retention policy

### AI & Procurement
- OpenAI API key, approved model list, monthly budget limit.
- Whether Alibaba integration is:
  - official API based, or
  - manual human-assisted flow only.
- If real seller messaging automation is required, explicit compliance/legal approval for method.

### Business Data & Product Rules
- Final category set and taxonomy ownership process.
- Real product import dataset (CSV/JSON): products, stock, pricing, media, tags.
- Rules for sections like `Trending`, `New Arrivals`, and merchandising overrides.
- Tax, shipping threshold, and pricing policy definitions.

### Monitoring & Incident Response
- Sentry/Datadog/Logtail (or equivalent) project access.
- Uptime monitor target + alert destinations (Slack/email).
- Who receives critical incident alerts.

### Legal/Policy
- Finalized Terms, Privacy, Refund/Return, and shipping policies.
- Data retention/deletion expectations.

### Acceptance Criteria
- UAT checklist for customer flow + admin flow + procurement flow.
- Explicit sign-off criteria for “production-ready”.

---

## 3) Suggested Execution Order (Recommended)

1. Lock architecture and access (auth, DB, deploy, secrets).
2. Make auth + authorization production-safe (middleware + server enforcement).
3. Unify order/payment state model and implement webhook-driven truth.
4. Persist all admin sections to DB and remove runtime-only state.
5. Productionize procurement persistence and decisioned seller-contact path.
6. Hardening pass: validation, rate limiting, security headers, abuse controls.
7. Add observability + alerting.
8. Add tests + CI quality gates.
9. Staging UAT, bugfix sprint, production cutover.

---

## 4) Definition of Done (High-Level)

- All critical customer and admin flows are DB-backed and durable.
- Auth and role checks are enforced on both UI access and APIs.
- Payment and order states reconcile via verified webhooks.
- Procurement flow is either fully real or clearly scoped to human-assisted mode.
- Monitoring and alerts are in place before launch.
- CI/tests prevent regressions.
- UAT sign-off completed against agreed checklist.
