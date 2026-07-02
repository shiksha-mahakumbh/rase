# Third-party open source licenses

The **rase** application is proprietary (see [`LICENSE`](../LICENSE)). It depends on open source packages distributed under their own licenses.

## Major runtime dependencies

| Package | License | Use |
|---------|---------|-----|
| Next.js | MIT | Web framework |
| React | MIT | UI library |
| `@prisma/client` | Apache-2.0 | Database ORM |
| `@supabase/supabase-js` | MIT | Auth & storage client |
| `zod` | MIT | Request validation |
| `razorpay` | MIT | Payment gateway SDK |
| `nodemailer` | MIT-0 | Transactional email |
| `sanitize-html` | MIT | CMS HTML sanitization |
| `@sentry/nextjs` | MIT | Error monitoring |
| `tailwindcss` | MIT | Styling |
| `framer-motion` | MIT | UI motion |
| `antd` | MIT | Admin UI components |

## Full dependency tree

Run locally (values not committed):

```bash
npm ci
npx license-checker --production --csv --out licenses.csv
```

Review `licenses.csv` before external distribution. Do not commit generated CSV if it includes build metadata from your environment.

## Trademarks

“Shiksha Mahakumbh”, “Department of Holistic Education”, partner logos, and event marks are property of their respective owners. Third-party trademarks (Google, Razorpay, Meta, Microsoft, etc.) belong to their owners.

## Contact

Legal or licensing questions: academics@shikshamahakumbh.com
