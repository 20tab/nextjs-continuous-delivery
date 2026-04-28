# Talos Submodule - NextJS

[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/python/black)

> A [NextJS](https://nextjs.org/) project template ready for continuous delivery.

## 🧩 Requirements

The Talos script can be run either using Docker or a Python virtual environment.

### 🐋 Docker

In order to run Talos via Docker, a working [Docker installation](https://docs.docker.com/get-docker/) is the only requirement.

### 🐍 Virtual environment

In order to run Talos in a virtual environment, first clone the repository in a local projects directory and ensure it is your current directory:

```console
cd ~/projects
git clone git@github.com:20tab/nextjs-continuous-delivery.git talos-nextjs
cd talos-nextjs
```

Then, create and activate a virtual environment and install the requirements:

```console
python3.12 -m venv .venv
source .venv/bin/activate
python3 -m pip install --upgrade pip setuptools
python3 -m pip install -r requirements/common.txt
```

The `terraform` cli package is required, unless you want to generate a project only locally. To install it we suggest to use the official [install guide](https://learn.hashicorp.com/tutorials/terraform/install-cli).

## 🔑 Credentials (optional)

### 🦊 GitLab

If the GitLab integration is enabled, a Personal Access Token with _api_ permission is required.<br/>
It can be generated in the GitLab User Settings panel.

**Note:** the token can be generated in the Access Tokens section of the GitLab User Settings panel.<br/>
⚠️ Beware that the token is shown only once after creation.

## 🚀️ Quickstart

Change to the projects directory, for example:

```console
cd ~/projects
```

### 🐋 Docker

```console
docker run --interactive --tty --rm --volume $PWD/.dumps:/app/.dumps --volume $PWD/.logs:/app/.logs --volume $PWD:/data 20tab/talos-nextjs:latest
```

### 🐍 Virtual environment

```console
source talos-nextjs/.venv/bin/activate
./talos-nextjs/start.py
```

### Example

```console
Project name: My Project Name
Project slug [my-project-name]:
Service slug [frontend]:
Project dirname (frontend, myprojectname) [frontend]: myprojectname
Terraform backend (gitlab, terraform-cloud) [terraform-cloud]:
Terraform host name [app.terraform.io]:
Terraform Cloud User token:
Terraform Organization: my-organization-name
Do you want to create Terraform Cloud Organization 'my-organization-name'? [y/N]:
Cluster slug hosting the 'development' environment [dev]:
Cluster slug hosting the 'staging' environment [dev]:
Cluster slug hosting the 'production' environment [main]:
Development environment complete URL [https://dev.my-project-name.com/]:
Staging environment complete URL [https://stage.my-project-name.com/]:
Production environment complete URL [https://www.my-project-name.com/]:
Do you want to configure Redis? [y/N]:
Do you want to use GitLab? [Y/n]:
GitLab group slug [my-project-name]:
Make sure the GitLab "my-project-name" group exists before proceeding. Continue? [y/N]: y
GitLab private token (with API scope enabled):
Sentry DSN (leave blank if unused) []:
Initializing the frontend service:
...cookiecutting the service
...generating the .env file
...creating the GitLab repository and associated resources
...creating the Terraform Cloud resources
```

The generated service deploys via the [Minos service module](https://gitlab.com/20tab-open/minos) using the `registry.gitlab.com/20tab-open/minos/service:latest` image and the OpenTofu GitLab Components (`opentofu/apply@3.11.0`). Each environment (`development`, `staging`, `production`) is mapped to a Kubernetes cluster slug via the prompts above.

## 🗒️ Arguments

The following arguments can be appended to the Docker and shell commands

#### User id

`--uid=$UID`

#### Group id

`--gid=1000`

#### Output directory

`--output-dir="~/projects"`

#### Project name

`--project-name="My project name"`

#### Project slug

`--project-slug="my-project-name"`

#### Project dirname

`--project-dirname="myprojectname"`

### 🎖️ Service

#### Service slug

`--service-slug=frontend`

#### Service port

`--internal-service-port=3000`

#### Backend Internal Url

`--internal-backend-url=http://backend:8000`

### 📐 Architecture

#### Terraform backend

| Name            | Argument                              |
| --------------- | ------------------------------------- |
| Terraform Cloud | `--terraform-backend=terraform-cloud` |
| GitLab          | `--terraform-backend=gitlab`          |

##### Terraform Cloud required argument

`--terraform-cloud-hostname=app.terraform.io`<br/>
`--terraform-cloud-token={{terraform-cloud-token}}`<br/>
`--terraform-cloud-organization`

##### Terraform Cloud create organization

`--terraform-cloud-organization-create`<br/>
`--terraform-cloud-admin-email={{terraform-cloud-admin-email}}`

Disabled args
`--terraform-cloud-organization-create-skip`

#### Env-to-cluster mapping

Each of the three environments (`development`, `staging`, `production`) is mapped to a Kubernetes cluster slug. Defaults: `dev` for development and staging, `main` for production. The mapping can be set non-interactively via repeated `--env-to-cluster` flags or supplied programmatically as a `dict[str, str]`.

#### Project Domain

If you don't want DigitalOcean DNS configuration the following args are required

`--project-url-dev=https://dev.project-domain.com`<br/>
`--project-url-stage=https://stage.project-domain.com`<br/>
`--project-url-prod=https://www.project-domain.com`

#### Redis

For enabling redis integration the following arguments are needed:

`--use-redis`

Disabled args
`--no-redis`

### 🦊 GitLab

> **⚠️ Important: Make sure the GitLab group exists before creating.** > https://gitlab.com/gitlab-org/gitlab/-/issues/244345

For enabling gitlab integration the following arguments are needed:

`--gitlab-private-token={{gitlab-private-token}}`<br/>
`--gitlab-group-path={{gitlab-group-path}}`

#### 🪖 Sentry

For enabling sentry integration the following arguments are needed:

`--sentry-dsn={{frontend-sentry-dsn}}`

#### 🔇 Quiet

No confirmations shown.

`--quiet`
