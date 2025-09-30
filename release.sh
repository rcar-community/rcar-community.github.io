#!/bin/bash

SCRIPT_DIR=$(cd `dirname $0` && pwd)
DEV_DIR=$SCRIPT_DIR/../rcar-community-board
cd ${SCRIPT_DIR}

# Copy from Dev environment
cp -rf ${DEV_DIR}/* -t ${SCRIPT_DIR}
# Remove/Resotre files
rm -rf Gemfile* local_debug.sh setup_ruby_ubuntu.sh _site _dev
git restore README.md

