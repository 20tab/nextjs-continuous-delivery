#!/bin/sh -e

set -euo pipefail

cd ${TF_ROOT}

cmd=../../scripts/terraform.sh

${cmd} init
${cmd} validate
${cmd} plan
${cmd} plan-json
${cmd} apply -auto-approve
