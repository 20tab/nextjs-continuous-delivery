#!/bin/sh -e

yarn install
exec "${@}"
