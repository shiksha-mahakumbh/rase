# Docker (local parity)

Production hosting uses **Vercel**. Docker provides a reproducible container for local smoke tests, disaster drills, and optional self-hosting.

## Build

```bash
docker build -t rase-web .
```

Build-time args (`DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SITE_URL`, `ADMIN_SESSION_SECRET`) default to safe placeholders so `npm run build` succeeds without a live database.

## Run with compose

```bash
cp .env.example .env.local   # fill Supabase + secrets
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000).

## Verify container health

```bash
curl -fsS http://localhost:3000/api/v2/health
curl -fsS http://localhost:3000/api/v2/status
```

## Notes

- Prisma client is generated during `npm ci` postinstall.
- For production-like checks, set real `DATABASE_URL` / `DIRECT_URL` in `.env.local`.
- Image uses Node **24** to match `package.json` engines and CI.
