import { withSentryConfig } from '@sentry/nextjs'

import type { NextConfig } from 'next'

const { SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_PROJECT_NAME, SENTRY_URL } =
  process.env

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingIncludes: {
    '/*': [
      './instrumentation.ts',
      './sentry.server.config.ts',
      './sentry.edge.config.ts'
    ]
  },
  reactStrictMode: true,
  rewrites: async () => [
    { source: '/frontend/health', destination: '/api/health' },
    { source: '/robots.txt', destination: '/api/robots' }
  ]
}

const sentryConfig = {
  authToken: SENTRY_AUTH_TOKEN,
  disableLogger: true,
  org: SENTRY_ORG,
  project: SENTRY_PROJECT_NAME,
  silent: !process.env.CI,
  url: SENTRY_URL,
  widenClientFileUpload: true
}

const config =
  SENTRY_AUTH_TOKEN && SENTRY_ORG && SENTRY_URL
    ? withSentryConfig(nextConfig, sentryConfig)
    : nextConfig

export default config
