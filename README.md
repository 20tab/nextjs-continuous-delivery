# Talos - NextJS

[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/python/black)

> A [NextJS](https://nextjs.org/) project template ready for continuous delivery.

## 🧩 Requirements

The Talos script can be run either using Docker or as a local shell command.

### 🐋 Docker

In order to run Talos via Docker, a working [Docker installation](https://docs.docker.com/get-docker/) is the only requirement.

### 👨‍💻 Shell command

In order to run Talos as a shell command, first clone the repository in a local projects directory
```console
cd ~/projects
git clone https://github.com/20tab/react-ts-continuous-delivery talos-nextjs
```
Then, install the following requirements
| Requirements | Instructions |
|--|--|
|🌎 Terraform  | [Install Guide](https://learn.hashicorp.com/tutorials/terraform/install-cli)  |
|🐍 Python Dependencies | `pip install -r talos/requirements/common.txt` |

## 🔑 Credentials

### 🦊 GitLab
If the GitLab integration is enabled, a Personal Access Token with _api_ permission is required.<br/>
It can be generated in the GitLab User Settings panel.

**Note:** the token can be generated in the Access Tokens section of the GitLab User Settings panel.<br/>
⚠️ Beware that the token is shown only once after creation.

## 🚀️ Quickstart

Change to the projects directory, for example
```console
cd ~/projects
```

### 🐋 Docker

```console
docker run --interactive --tty --rm --volume $PWD:/data 20tab/talos-nextjs:latest
```

### 👨‍💻 Shell command

```console
./talos-nextjs/setup.py
```

### Example
```console
Project name: My Project Name
Project slug [my-project-name]:
Service slug [frontend]:
Project dirname (frontend, myprojectname) [frontend]: myprojectname
Development environment complete URL [https://dev.my-project-name.com/]:
Staging environment complete URL [https://stage.my-project-name.com/]:
Production environment complete URL [https://www.my-project-name.com/]:
Do you want to configure Redis? [y/N]:
Do you want to configure GitLab? [Y/n]:
GitLab group slug [my-project-name]:
Make sure the GitLab "my-project-name" group exists before proceeding. Continue? [y/N]: y
GitLab private token (with API scope enabled):
Comma-separated GitLab group owners []:
Comma-separated GitLab group maintainers []:
Comma-separated GitLab group developers []:
Initializing the frontend service:
...cookiecutting the service
...generating the .env file
```

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

### 🎖️ Frontend Service

#### Service slug
`--service-slug=frontend`

#### Service port
`--internal-service-port=3000`

#### Project Domain
If you don't want DigitalOcean DNS configuration the following args are required

`--project-url-dev=https://dev.project-domain.com`<br/>
`--project-url-stage=https://stage.project-domain.com`<br/>
`--project-url-prod=https://www.project-domain.com`

#### Redis
For enable redis integration the following arguments are needed:

`--use-redis`<br/>
`--digitalocean-redis-cluster-region=fra1`<br/>
`--digitalocean-redis-cluster-node-size=db-s-1vcpu-2gb`

Disabled args
`--no-redis`

### 🦊 GitLab
> **⚠️ Important:  Make sure the GitLab group exists before create.**
> https://gitlab.com/gitlab-org/gitlab/-/issues/244345

For enable gitlab integration the following arguments are needed:

`--use-gitlab`<br/>
`--gitlab-private-token={{gitlab-private-token}}`<br/>
`--gitlab-group-slug={{gitlab-group-slug}}`

Disabled args
`--no-gitlab`

Add user to repository using comma separeted arguments

`--gitlab-group-owners=user1, user@example.org`<br/>
`--gitlab-group-maintainers=user1, user@example.org`<br/>
`--gitlab-group-developers=user1, user@example.org`

#### 🪖 Sentry
For enable sentry integration the following arguments are needed:

`--sentry-dsn={{frontend-sentry-dsn}}`

#### 🔇 Silent
Is command for use default if no args are provided

`--silent`
