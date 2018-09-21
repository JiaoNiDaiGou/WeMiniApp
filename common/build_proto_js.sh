#!/bin/bash

set -euo pipefail

ROOT="${ROOT:-$(git rev-parse --show-toplevel)}"
cp -R $ROOT/../AppEngine/wire-model/build/generated/source/proto/main/js/* $ROOT/daigou/model/

