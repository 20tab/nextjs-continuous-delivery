# {{ cookiecutter.project_name }}

Next.js service generated from the [20tab nextjs template](https://github.com/20tab/nextjs-continuous-delivery).
Deployed on Kubernetes via [MINOS Service](https://gitlab.com/20tab-open/minos/service).

## Stack

- **Next.js** (Pages Router) + **React 19** + **TypeScript 6**
- **Tailwind CSS v4** (PostCSS)
- **ESLint** flat config + **Prettier**
- **Jest** for unit tests, **jest-pact** for contract tests
- **Sentry** via Next.js instrumentation hooks
- Package manager: **Yarn** (Corepack-managed, version pinned in `.yarnrc.yml`)

## Getting started

Enable Yarn through Corepack and install dependencies:

```bash
corepack enable
yarn install
```

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Available scripts

| Script                  | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `yarn dev`              | Start the Next.js dev server                     |
| `yarn build`            | Production build                                 |
| `yarn start`            | Run the production build                         |
| `yarn lint`             | Run ESLint                                       |
| `yarn format`           | Format files with Prettier                       |
| `yarn fix`              | Lint with `--fix`, then format                   |
| `yarn test`             | Run unit tests (Jest, excluding contracts)       |
| `yarn pact`             | Run Pact contract tests                          |
| `yarn ci:unit-test`     | CI unit-test run with coverage and JUnit reports |
| `yarn ci:contract-test` | CI Pact contract-test run                        |

## Updating dependencies

```bash
yarn upgrade-interactive
```

## Docker

Two Dockerfiles are provided in [docker/](docker/):

- [docker/local.Dockerfile](docker/local.Dockerfile) — local/dev image
- [docker/remote.Dockerfile](docker/remote.Dockerfile) — multi-stage image used by the CI build

## Deployment — MINOS Service

This service deploys to Kubernetes through MINOS Service. Per-environment configuration lives under [minos/](minos/):

```
minos/
├── common.tfvars              # shared across environments
├── development/
│   ├── this.tfvars            # cluster_slug, namespace, routing, certificates
│   └── shared-config.yaml     # non-sensitive env vars
├── staging/
│   ├── this.tfvars
│   └── shared-config.yaml
└── production/
    ├── this.tfvars
    └── shared-config.yaml
```

Sensitive values are pulled from Vault at pipeline time; non-sensitive values come from `shared-config.yaml`.

## GitLab pipeline — CI/CD

> **Branch protection:** `develop`, `main`, and tags must be protected.

Pipeline mapping:

| Branch / ref | Environment |
| ------------ | ----------- |
| `develop`    | development |
| `main`       | staging     |
| Git tag      | production  |

Each environment runs: **Test → (Pact publish) → (Can-I-Deploy) → Build → Deploy → (Pact tag) → (Sentry release)**.

### Pipeline toggles

| Variable              | Effect                                          |
| --------------------- | ----------------------------------------------- |
| `SKIP_TEST=true`      | Skip the test stage                             |
| `SKIP_DEPLOY=true`    | Skip deploy and related Sentry/Pact steps       |
| `PACT_ENABLED=true`   | Enable Pact broker publish + can-i-deploy + tag |
| `SENTRY_ENABLED=true` | Enable Sentry release tracking                  |

### Pact broker integration

Set in the GitLab repository (the broker URL/credentials must be **protected** and **masked**):

```
PACT_ENABLED=true
PACT_BROKER_BASE_URL
PACT_BROKER_USERNAME
PACT_BROKER_PASSWORD
```

### Sentry integration

```
SENTRY_ENABLED=true
SENTRY_DSN                  # protected, masked
SENTRY_AUTH_TOKEN           # protected, masked
SENTRY_ORG                  # protected, e.g. 20tab
SENTRY_URL                  # protected, e.g. https://sentry.io/
SENTRY_TRACES_SAMPLE_RATE   # e.g. 0.1
```

## Kubernetes resource limits

Deployment resource requests/limits are defined per environment in `minos/<env>/this.tfvars`. Tune them to match the expected load and the size of the available cluster nodes.

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Jest](https://jestjs.io/) · [jest-pact](https://github.com/pact-foundation/jest-pact)
- [Sentry for Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [MINOS Service](https://gitlab.com/20tab-open/minos/service)
