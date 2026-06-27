/** Vercel Sentry integration may set SENTRY_DSN; app reads NEXT_PUBLIC_SENTRY_DSN. */
export function getSentryDsn(): string | undefined {
  return process.env.NEXT_PUBLIC_SENTRY_DSN ?? process.env.SENTRY_DSN;
}

export function isSentryConfigured(): boolean {
  return Boolean(getSentryDsn());
}
