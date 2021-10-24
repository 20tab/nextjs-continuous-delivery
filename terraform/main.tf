locals {
  user_data = jsondecode(data.http.user_info.body)

  git_config = "-c user.email=${local.user_data.email} -c user.name=\"${local.user_data.name}\""
}

terraform {
  backend "local" {
  }

  required_providers {
    gitlab = {
      source  = "gitlabhq/gitlab"
      version = "3.7.0"
    }
  }
}

/* Providers */

provider "gitlab" {
  token = var.gitlab_token
}

/* Data Sources */

data "gitlab_group" "group" {
  full_path = var.gitlab_group_slug
}

data "http" "user_info" {
  url = "https://gitlab.com/api/v4/user"

  request_headers = {
    Accept        = "application/json"
    Authorization = "Bearer ${var.gitlab_token}"
  }
}

/* Resources */

resource "gitlab_project" "main" {
  name                   = title(var.service_slug)
  path                   = var.service_slug
  description            = "The \"${var.project_name}\" project ${var.service_slug} service."
  namespace_id           = data.gitlab_group.group.id
  initialize_with_readme = false
}

resource "null_resource" "init_repo" {
  depends_on = [gitlab_branch_protection.develop]

  triggers = {
    service_project_id = gitlab_project.main.id
  }

  provisioner "local-exec" {
    command = join(" && ", [
      "cd ${var.service_dir}",
      format(
        join(" && ", [
          "git init --initial-branch=develop",
          "git remote add origin %s",
          "git add .",
          "git ${local.git_config} commit -m 'Initial commit'",
          "git push -u origin develop -o ci.skip",
          "git checkout -b master",
          "git push -u origin master -o ci.skip",
          "git remote set-url origin %s",
        ]),
        replace(
          gitlab_project.main.http_url_to_repo,
          "/^https://(.*)$/",
          "https://oauth2:${var.gitlab_token}@$1"
        ),
        gitlab_project.main.ssh_url_to_repo,

      )
    ])
  }
}

resource "gitlab_branch_protection" "develop" {
  project            = gitlab_project.main.id
  branch             = "develop"
  push_access_level  = "maintainer"
  merge_access_level = "developer"
}

resource "gitlab_branch_protection" "master" {
  depends_on = [null_resource.init_repo]

  project            = gitlab_project.main.id
  branch             = "master"
  push_access_level  = "no one"
  merge_access_level = "maintainer"
}

resource "gitlab_tag_protection" "tags" {
  project             = gitlab_project.main.id
  tag                 = "*"
  create_access_level = "maintainer"
}

resource "gitlab_project_badge" "coverage" {
  project   = gitlab_project.main.id
  link_url  = "https://${var.project_slug}.gitlab.io/${var.service_slug}/"
  image_url = "https://gitlab.com/%%{project_path}/badges/%%{default_branch}/pipeline.svg"
}

resource "gitlab_project_badge" "pipeline" {
  project   = gitlab_project.main.id
  link_url  = "https://gitlab.com/%%{project_path}/pipelines"
  image_url = "https://gitlab.com/%%{project_path}/badges/%%{default_branch}/pipeline.svg"
}
