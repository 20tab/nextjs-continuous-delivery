import * as Sentry from '@sentry/nextjs'

const { NEXT_PUBLIC_SENTRY_DSN, NEXT_PUBLIC_SENTRY_TRACE_SAMPLE_RATE } =
  process.env

if (NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: Number(NEXT_PUBLIC_SENTRY_TRACE_SAMPLE_RATE || 0.1),
    debug: false
  })
}
