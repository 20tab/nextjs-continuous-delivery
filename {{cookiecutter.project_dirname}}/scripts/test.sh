#!/usr/bin/env sh

set -e

yarn install
yarn upgrade --latest
exec "${@}"
