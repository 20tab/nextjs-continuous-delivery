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

provider "gitlab" {
  token = var.gitlab_token
}

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

resource "gitlab_project" "frontend" {
  name                   = "Frontend"
  path                   = "frontend"
  description            = "The \"${var.project_name}\" project frontend service."
  namespace_id           = data.gitlab_group.group.id
  default_branch         = "develop"
  initialize_with_readme = false
}

resource "null_resource" "init_frontend" {
  depends_on = [gitlab_branch_protection.develop_frontend]

  triggers = {
    frontend_project_id = gitlab_project.frontend.id
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
          gitlab_project.frontend.http_url_to_repo,
          "/^https://(.*)$/",
          "https://oauth2:${var.gitlab_token}@$1"
        ),
        gitlab_project.frontend.ssh_url_to_repo,

      )
    ])
  }
}

resource "gitlab_branch_protection" "develop_frontend" {
  project            = gitlab_project.frontend.id
  branch             = "develop"
  push_access_level  = "maintainer"
  merge_access_level = "developer"
}

resource "gitlab_branch_protection" "master_frontend" {
  depends_on = [null_resource.init_frontend]

  project            = gitlab_project.frontend.id
  branch             = "master"
  push_access_level  = "no one"
  merge_access_level = "maintainer"
}

resource "gitlab_tag_protection" "tags_frontend" {
  project             = gitlab_project.frontend.id
  tag                 = "*"
  create_access_level = "maintainer"
}

resource "gitlab_project_badge" "coverage_frontend" {
  project   = gitlab_project.frontend.id
  link_url  = "https://${var.project_slug}.gitlab.io/frontend/"
  image_url = "https://gitlab.com/%%{project_path}/badges/%%{default_branch}/pipeline.svg"
}

resource "gitlab_project_badge" "pipeline_frontend" {
  project   = gitlab_project.frontend.id
  link_url  = "https://gitlab.com/%%{project_path}/pipelines"
  image_url = "https://gitlab.com/%%{project_path}/badges/%%{default_branch}/pipeline.svg"
}
