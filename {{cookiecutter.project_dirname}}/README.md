This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Getting started

This service is generated from [20tab standard project](https://github.com/20tab/20tab-standard-project) template or
[20tab nextjs template](https://github.com/20tab/nextjs-continuous-delivery)

## The Kubernetes resource limits

The Kubernetes deployment service limits should be adapted to the expected load of the other services and to the size of the available nodes.
By default, the `s-1vcpu-1gb-amd` DigitalOcean droplet is used (https://slugs.do-api.dev/), which allocates 900.00m of CPU capacity and 1.54Gi of memory capacity.
The following default values are calculated assuming 2 deployments and 2 stacks on a single node.

| tfvars name | default value |
|--|--|
| service_limits_cpu | 225m |
| service_limits_memory | 256Mi |
| service_requests_cpu | 25m |
| service_requests_memory | 115Mi |

## Git

To get the existing project, change directory, clone the project repository and enter the newly created **{{ cookiecutter.project_slug }}** directory.

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
npm run lint
```
or
```bash
yarn lint
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
  COMPOSE_FILE=docker-compose.yaml:docker-compose/volumes.yaml:docker-compose/services.yaml:docker-compose/provider.yaml
  INTERNAL_BACKEND_URL=http://provider:8000
  NEXT_PUBLIC_PROJECT_URL=https://localhost:8443
  REACT_ENVIRONMENT=development
  SERVICE_DOCKER_FILE=docker/local.Dockerfile
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

# GitLab pipeline - CI/CD

:warning: **develop, main and tags**: should be protected!

## E2E Integration
The E2E integration, can be skip using following variable that should be set in the GitLab respository:
```git
  SKIP_E2E = true
```

## Pact broker Integration
To enable the Pact broker integration, the following variables should be set in the GitLab respository:
```git
  PACT_ENABLED = true
  PACT_BROKER_BASE_URL (protected and masked)
  PACT_BROKER_PASSWORD (protected)
  PACT_BROKER_USERNAME (protected)
```

## Monitoring
### Sentry integration

To enable the Sentry integration, the following variables should be set in the GitLab respository:
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
