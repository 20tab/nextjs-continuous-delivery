#!/bin/bash
docker stop {{cookiecutter.project_slug}}_pact

docker rm -f {{cookiecutter.project_slug}}_pact

docker run \
  -t \
  -p 8080:8080 \
  --network {{cookiecutter.project_slug}}_default \
  --name {{cookiecutter.project_slug}}_pact \
  -v "$(pwd)/__tests__/pacts/:/app/pacts" \
  pactfoundation/pact-stub-server \
  -p 8080 \
  -d pacts \
  --cors \
