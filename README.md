# Vishwakarma Kutumb API

NestJS + Prisma + PostgreSQL backend for the Vishwakarma Kutumb mobile app. Implements the
REST endpoints the RN app's `src/services/*Service.ts` mock resolvers were already shaped to
match — swapping the app from mock data to this backend should not require changing any
screen or component, only the service functions (see the mobile app's README).

## Why this exists
The app's roadmap had "wire up a real backend" as its #1 open item. This is that backend —
a real, runnable NestJS project, not a stub. The one thing that *couldn't* be finished here:
`npx prisma generate` needs to download a query-engine binary from `binaries.prisma.sh`, and
this sandbox's network policy only allows npm/GitHub/PyPI/crates.io. That's a one-time step
you'll run yourself locally (completely normal for any Prisma project — it's not something
specific to this codebase). Everything else has been typechecked as far as possible without it
— see "Verification" below.

## Stack
- NestJS 10, TypeScript
- Prisma 5 + PostgreSQL
- JWT auth (`@nestjs/jwt` + `passport-jwt`)
- RBAC via a `@Roles()` decorator + guard (member / village_admin / super_admin)
- `@nestjs/schedule` cron job that actually flips ads `scheduled → live → expired`
- `@nestjs/throttler` basic rate limiting

## Getting started

```bash
# 1. Start Postgres (or point DATABASE_URL at your own instance)
docker compose up -d

# 2. Install dependencies
npm install

# 3. Configure env
cp .env.example .env
# edit .env if you're not using the default docker-compose Postgres

# 4. Generate the Prisma client and run migrations
npx prisma generate
npx prisma migrate dev --name init

# 5. Seed sample data (mirrors the RN app's mock fixtures)
npm run prisma:seed

# 6. Run
npm run start:dev
```

The API listens on `http://localhost:3000/api/v1` by default.

## Auth flow
```
POST /api/v1/auth/otp/request   { phone }
POST /api/v1/auth/otp/verify    { phone, otp, demoRole? } -> { user, token }
```
- OTP delivery is mocked (`OtpProviderService` logs the code to the console — default
  `123456`, overridable via `OTP_MOCK_CODE`). Swap it for a real SMS gateway (MSG91, Twilio
  Verify, etc.) by implementing the same `send(phone, code)` method; nothing else changes.
- `demoRole` exists **only** so the still-demo RN client can preview all three role
  experiences before real role assignment (invites, admin-promotion flows) is built. Remove
  it from `VerifyOtpDto` and `AuthService.verifyOtp` once that exists — production sign-ups
  should always default to `member`.
- All other endpoints require `Authorization: Bearer <token>`.

## Endpoints
| Resource | Routes |
|---|---|
| Villages | `GET /villages?query=`, `GET /villages/:id`, `POST /villages` (super_admin), `PATCH /villages/:id` (super_admin), `PATCH /villages/:id/toggle-active` (super_admin) |
| Families | `GET /families?villageId=&query=`, `GET /families/:id`, `POST /families` (village_admin+), `DELETE /families/:id` (village_admin+) — soft delete |
| Members | `GET /members?familyId=` or `?villageId=&query=`, `GET /members/:id`, `POST /members`, `PATCH /members/:id`, `DELETE /members/:id`, `PATCH /members/:familyId/set-head/:memberId` |
| Notifications | `GET /notifications` (per-user read state), `POST /notifications` (village_admin+), `PATCH /notifications/:id/read` |
| Feed | `GET /feed`, `PATCH /feed/:id/like` |
| Ads | `GET /ads?villageId=&status=`, `POST /ads` (creates as `pending_payment`), `PATCH /ads/:id/status` (village_admin+) |
| Admins | `GET /admins`, `POST /admins`, `PATCH /admins/:id/toggle-active` — all super_admin only |
| Payments | `GET /payments`, `POST /payments` (mock charge, ~10% simulated decline) |
| Pricing | `GET /pricing`, `PATCH /pricing/:product` (super_admin) |
| Platform Settings | `GET /platform-settings`, `PATCH /platform-settings` — both super_admin only |

## The ad scheduler (real, not simulated)
`AdsSchedulerService` runs every 15 minutes (`*/15 * * * *`) and:
- flips `scheduled → live` once an ad's `startDate` has passed
- flips `live → expired` once its `endDate` has passed

`startDate`/`endDate` get stamped automatically when an ad is approved (`PATCH
/ads/:id/status` with `status: "scheduled"`), using the product's `durationDays` from
`AdPricing`. This closes out the roadmap's "Create → Availability → Price → Payment →
Approval → **Schedule → Publish**" pipeline for real — the mobile app's mock version could
only simulate the payment step, not a real clock.

## What still needs your own credentials
These two integrations are coded to the point where only your account details are missing —
I can't create Firebase or Razorpay accounts on your behalf:

- **Payments**: `PaymentsService.create()` is a documented drop-in point for Razorpay
  (order-create → Checkout SDK → webhook-verified capture). See the comment at the top of
  `src/payments/payments.service.ts` for the exact 3 steps.
- **Push notifications**: not yet in this backend at all. Once you have a Firebase project,
  add an FCM module that stores device tokens per user (new `DeviceToken` model) and sends
  via `firebase-admin` when a `Notification` is created.

## Verification
Typechecked with `npx tsc --noEmit`. Every remaining error is `@prisma/client` not yet
generated (see "Why this exists" above) — confirmed by grepping the error output for
anything other than `has no exported member` on `@prisma/client`/`Prisma.*GetPayload`, which
returns nothing. Re-run after `npx prisma generate` to confirm a clean compile end to end.

## Security notes (per PRODUCT_BIBLE.md §14)
- JWT with a configurable expiry (`JWT_EXPIRES_IN`, default 7 days) — no refresh-token flow
  yet; add one before shipping (short-lived access token + long-lived refresh token).
- RBAC enforced via `RolesGuard`, checked after `JwtAuthGuard` on every guarded route.
- Soft deletes on Village/Family/Member (`deletedAt`), never hard-deleted.
- Append-only `AuditLog` model, currently only written on login — extend to admin
  create/update/delete actions before production.
- Basic rate limiting via `@nestjs/throttler` (100 req/min/IP) — tune per environment.
