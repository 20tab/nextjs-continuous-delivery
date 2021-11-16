This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Getting Started

This service is generated from [20tab standard project](https://github.com/20tab/20tab-standard-project) template or
[20tab nextjs template](https://github.com/20tab/react-ts-continuous-delivery)

## Git

To get the existing project, change directory, clone the project repository and enter the newly created **{{ cookiecutter.project_slug }}** directory:

*Full services version*
```bash
git clone git@gitlab.com:{{ cookiecutter.project_slug }}/orchestrator.git {{ cookiecutter.project_slug }} && \
cd {{ cookiecutter.project_slug }}  && \
git checkout main  && \
git clone git@gitlab.com:{{ cookiecutter.project_slug }}/backend.git  && \
cd backend  && \
git checkout develop  && \
cd ..  && \
git clone git@gitlab.com:{{ cookiecutter.project_slug }}/{{ cookiecutter.service_slug }}.git  && \
cd {{ cookiecutter.service_slug }}  && \
git checkout develop
```

*Frontend service only*
```bash
git clone git@gitlab.com:{{ cookiecutter.project_slug }}/{{ cookiecutter.service_slug }}.git {{ cookiecutter.project_slug }} && \
git checkout develop && \
cd {{ cookiecutter.project_slug }}
```

## Run local service

First, run the development server:

```bash
npm run dev
```
or
```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


# Linting

To check all file linting, execute:

```bash
npm run eslint
```
or
```bash
yarn eslint
```

# Update package

To update packages, execute:

```bash
yarn upgrade --latest
```

To check audit, execute:

```bash
npm run audit:fix
```
or
```bash
yarn audit:fix
```

# Testing

## Unit test

To run the unit test suite, execute:

```bash
npm run test
```
or
```bash
yarn test
```

## Contract tests

To run the pact test suite, execute:

```bash
npm run pact
```
or
```bash
yarn pact
```

# Pact stub server
Pact contracts are easily turned into locally running API stubs.

## Using full docker-compose implementation

```bash
npm run pact && \
docker-compose up
```
or
```bash
yarn pact && \
docker-compose up
```

## Using custom docker-compose implementation

:warning: **env variable** in custom mode you must be sure to have env, set in the system or in `.env` file.

```bash
  INTERNAL_BACKEND_URL=http://localhost:8080
  NEXT_PUBLIC_PROJECT_URL=http://localhost:8080
  REACT_ENVIRONMENT=Development
```

After env check you can run the following commands:

```bash
npm run pact && \
docker-compose up provider && \
npm run dev
```
or
```bash
yarn pact && \
docker-compose up provider && \
yarn dev
```

# Gitlab pipeline - CI/CD

:warning: **develop, master and tags**: should be protected!
## Pact broker Integration
To enable the Pact broker integration, the following variables should be set in the Gitlab respository:
```git
  PACT_ENABLED = true
  PACT_BROKER_BASE_URL (protected and masked)
  PACT_BROKER_PASSWORD (protected)
  PACT_BROKER_USERNAME (protected)
```
## Monitoring
### Sentry integration

To enable the Sentry integration, the following variables should be set in the Gitlab respository:
```git
  SENTRY_AUTH_TOKEN (protected and masked) from Sentry
  SENTRY_DSN (protected and masked) from Sentry
  SENTRY_ORG (protected) e.g.: 20tab
  SENTRY_URL (protected) e.g.: https://sentry.io/
```

# Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Next.js functions](https://nextjs.org/docs/basic-features/data-fetching) - learn about Next.js functions.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
