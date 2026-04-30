import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN

const SENTRY_TRACES_SAMPLE_RATE = Number(
  process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE || 0.1
)

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: SENTRY_TRACES_SAMPLE_RATE,
    debug: false
  })
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
