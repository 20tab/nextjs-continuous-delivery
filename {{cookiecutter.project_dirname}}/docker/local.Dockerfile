# syntax=docker/dockerfile:1

FROM node:20-bullseye-slim
ARG DEBIAN_FRONTEND=noninteractive GROUP_ID=1000 USER_ID=1000 USER=appuser
ENV LANG=C.UTF-8 LC_ALL=C.UTF-8 NEXT_TELEMETRY_DISABLED=1 NODE_ENV="development" USER=$USER WORKDIR=/app
RUN apt-get update \
    && apt-get install --assume-yes --no-install-recommends \
        g++ \
        git \
        make \
        openssh-client \
        python3 \
        wget \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /
COPY --chown=node ./package.json ./
COPY --chown=node ./yarn.lock ./
RUN yarn install --ignore-optional
ENV PATH="/node_modules/.bin:${PATH}"
RUN userdel -r node
RUN addgroup --system --gid $GROUP_ID $USER
RUN adduser --system --uid $USER_ID $USER
WORKDIR $WORKDIR
RUN chown $USER_ID:$GROUP_ID $WORKDIR
USER $USER_ID:$GROUP_ID
ENTRYPOINT ["./scripts/entrypoint.sh"]
CMD yarn start
LABEL company="20tab" project="{{ cookiecutter.project_slug }}" service="frontend" stage="local"
