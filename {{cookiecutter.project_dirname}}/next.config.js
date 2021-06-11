const { withSentryConfig } = require('@sentry/nextjs')

const nextjsConfig = {
  poweredByHeader: false,
  rewrites: async () => [{ source: '/_api/:path*', destination: '/api/:path*' }]
}

// Sentry config. For all available options, see:
// https://github.com/getsentry/sentry-webpack-plugin#options
const SentryWebpackPluginOptions = {
  authToken: process.env.SENTRY_AUTH_TOKEN,
  org: '__SENTRY_ORG__',
  project: '{{cookiecutter.project_slug}}-frontend',
  url: '__SENTRY_URL__'
}

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
const config =
  process.env.NODE_ENV === 'development'
    ? nextjsConfig
    : withSentryConfig(nextjsConfig, SentryWebpackPluginOptions)

module.exports = config
