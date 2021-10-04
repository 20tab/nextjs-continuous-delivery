const { withSentryConfig } = require('@sentry/nextjs')

const nextjsConfig = {}

const { SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_URL } = process.env

// Sentry config. For all available options, see:
// https://github.com/getsentry/sentry-webpack-plugin#options
const SentryWebpackPluginOptions = {
  authToken: SENTRY_AUTH_TOKEN,
  org: SENTRY_ORG,
  project: '{{cookiecutter.project_slug}}-frontend',
  url: SENTRY_URL
}

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
const config = SENTRY_AUTH_TOKEN && SENTRY_ORG && SENTRY_URL
  ? withSentryConfig(nextjsConfig, SentryWebpackPluginOptions)
  : nextjsConfig

module.exports = config