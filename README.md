# Shiksha Mahakumbh — rase.co.in

Production web platform for **Shiksha Mahakumbh 6.0** (national education summit). Built with Next.js App Router, Supabase Postgres (Prisma), and Vercel.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React, Tailwind CSS |
| Backend | Route handlers under `src/app/api/v2/` |
| Database | PostgreSQL (Supabase) via Prisma |
| Auth | Supabase + signed admin session cookies |
| Payments | Razorpay |
| Hosting | Vercel |

## Quick start

```bash
npm ci
cp .env.example .env.local   # fill DATABASE_URL, DIRECT_URL, Supabase keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` to `.env.local`. Required for local dev:

- `DATABASE_URL` — Supabase pooler (port 6543)
- `DIRECT_URL` — direct Postgres (port 5432) for migrations
- `NEXT_PUBLIC_SITE_URL`
- Supabase anon + service role keys

Verify: `npm run verify:env` | `npm run audit:secrets`

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run test:security` | Security + audit phase checks |
| `npm run test:unit` | Node unit tests (`tests/unit`) |
| `npm run test:e2e` | Playwright smoke + accessibility specs |
| `npm run test:smoke` | HTTP smoke probes (prod URL or pass base URL) |
| `npm run test:integration` | Integration script contracts (+ optional live run) |
| `npm run test:load` | Concurrent health load baseline |
| `npm run audit:secrets` | Static scan for secret leaks and tracked `.env` files |
| `npm run certify:go-live` | Final go-live certification bundle (set `RUN_LIVE_GO_LIVE=1` for live probes) |
| `npm run verify:rollback` | Static rollback readiness checks |
| `npm run verify:monitoring` | Live `/status` and health monitoring probes |
| `npm run validate:go-live` | HTTPS, HSTS, sitemap, and health go-live probes |
| `npm run db:validate` | Validate Prisma schema |

## Project layout

```
src/
  app/           # Routes (App Router)
  components/    # UI by feature
  lib/           # Shared helpers, schemas, SEO
  server/        # Services, API handler, Prisma client
prisma/          # Schema and migrations
scripts/         # Audits, seeds, CI helpers
tests/unit/      # Node native unit tests
e2e/             # Playwright smoke and a11y specs
docs/devops/     # Docker, secrets, alerting, runbooks
docs/go-live/     # DNS, sign-off, launch checklists
docs/legal/       # Privacy, terms, cookies, licenses
docs/            # Platform, deployment, conventions
public/          # Static assets, ads.txt, manifest
```

See [docs/CODE_CONVENTIONS.md](docs/CODE_CONVENTIONS.md) for naming and API rules.

## Quality gates

CI (`.github/workflows/ci.yml`) runs lint, typecheck, security tests, performance audit, and build on every push to `main`.

Enterprise audit progress is tracked via `scripts/test-security-phase1.mjs` through `phase14.mjs` in the `test:security` chain.

## Migrations

```bash
npm run db:migrate:deploy
```

Uses `scripts/prisma-migrate-deploy.mjs` to load `.env` / `.env.local` (Prisma 6 skips dotenv when `prisma.config.mjs` is present).

## License

Proprietary — Shiksha Mahakumbh / rase.co.in. See repository owner for terms.