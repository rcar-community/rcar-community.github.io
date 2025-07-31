#!/bin/bash

SCRIPT_DIR=$(cd `dirname $0` && pwd)
DEV_DIR=$SCRIPT_DIR/../rcar-community-board
cd ${SCRIPT_DIR}

# Copy from Dev environment
cp -rf ${DEV_DIR}/* -t ${SCRIPT_DIR}
# Remove/Resotre files
rm -rf Gemfile* local_debug.sh setup_ruby_ubuntu.sh _site
git restore README.md

# WA: Cleanup redirect page
if [[ "$(grep 'meta http-equiv="refresh"' ./index.html)" != "" ]]; then
    mv ./index.html ./_index.html
    grep -e "---" -e "layout" -e "^title" -e "meta" ./_index.html > ./index.html
    rm -f ./_index.html
fi

