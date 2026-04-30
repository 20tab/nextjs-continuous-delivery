# syntax=docker/dockerfile:1

FROM node:{{ cookiecutter.node_version }}-alpine
ARG GROUP_ID=1000 USER_ID=1000 USER=appuser
ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV="development" \
    PACT_DO_NOT_TRACK=1 \
    PATH="/node_modules/.bin:${PATH}" \
    USER=$USER \
    WORKDIR=/app
RUN apk add --no-cache git openssh-client
RUN corepack enable && corepack prepare yarn@stable --activate
WORKDIR /
COPY ./package.json ./yarn.lock ./.yarnrc.yml ./
RUN yarn install
RUN deluser --remove-home node
RUN addgroup --system --gid $GROUP_ID $USER
RUN adduser --system --uid $USER_ID --ingroup $USER $USER
WORKDIR $WORKDIR
RUN chown $USER_ID:$GROUP_ID $WORKDIR
USER $USER_ID:$GROUP_ID
ENTRYPOINT ["./scripts/entrypoint.sh"]
CMD ["yarn", "dev"]
LABEL company="20tab" project="{{ cookiecutter.project_slug }}" service="frontend" stage="local"
