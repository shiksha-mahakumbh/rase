# Legal documentation

| Document | Public URL | Source |
|----------|------------|--------|
| Privacy Policy | `/privacy-policy` | `src/app/privacy-policy/page.tsx` (+ CMS override) |
| Terms & Conditions | `/terms-and-conditions` | `src/app/terms-and-conditions/page.tsx` |
| Cookie Policy | `/cookie-policy` | `src/app/cookie-policy/page.tsx` |
| Refund Policy | `/refund-policy` | `src/app/refund-policy/page.tsx` |
| Disclaimer | `/disclaimer` | `src/app/disclaimer/page.tsx` |
| Open Source Licenses | `/licenses` | `src/app/licenses/page.tsx` |

CMS pages with slug matching the above and `pageType: "policy"` override the static fallback content via `src/lib/cms/legal-page-loader.tsx`.

Proprietary application license: [`LICENSE`](../LICENSE) at repository root.

Third-party OSS attributions: [`THIRD_PARTY_LICENSES.md`](./THIRD_PARTY_LICENSES.md).
