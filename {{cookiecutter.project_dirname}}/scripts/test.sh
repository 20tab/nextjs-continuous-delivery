#!/usr/bin/env sh

set -e

yarn install
exec "${@}"
