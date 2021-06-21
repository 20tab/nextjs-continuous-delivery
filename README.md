# React Typescript (SSR) continuous delivery

> A [React](https://github.com/facebook/create-react-app) project cookiecutter ready for continuous delivery.

## 📝 Conventions

In the following instructions:

- replace `projects` with your actual projects directory
- replace `My project name` with your chosen project name

## 🧩 Requirements

[Cookiecutter](https://cookiecutter.readthedocs.io) must be installed before initializing the project.

```console
$ python3 -m pip install cookiecutter
```

## 🚀️ Quickstart

Change directory and create a new project as in this example:

```console
$ cd ~/projects/
$ cookiecutter https://github.com/20tab/20tab-standard-project
project_name: My Project Name
project_slug [myprojectname]:
domain_url [myprojectname.com]:
Select which_frontend:
1 - None
2 - React
Choose from 1, 2 [1]:
Select use_gitlab:
1 - Yes
2 - No
Choose from 1, 2 [1]:
Select use_media:
1 - Yes
2 - No
Choose from 1, 2 [1]:
Generated '.env' file.
Generated '/requirements/common.txt' file.
Generated '/requirements/dev.txt' file.
Generated '/requirements/prod.txt' file.
Generated '/requirements/tests.txt' file.
Generated '/static' directory.
Choose the gitlab group path slug [myprojectname]:
Insert a comma separated list of usernames to set as group owners:
Insert a comma separated list of usernames to set as group mantainers:
```
