#!/bin/bash

SCRIPT_DIR=$(cd `dirname $0` && pwd)
DEV_DIR=$SCRIPT_DIR/../rcar-community-board
cd ${SCRIPT_DIR}

print_err() {
    for arr in "$@"; do
        echo -e "\e[31m$arr\e[m"
    done
}

# Check development repository branch
DEV_BRANCH=$(git -C ${DEV_DIR} branch | grep '* ' | awk '{print $2}')
if [[ "${DEV_BRANCH}" != "main" ]]; then
    print_err "ERROR: ${DEV_DIR} is not main branch.($DEV_BRANCH}"
    echo      ""
    print_err "Please change branch to main and rerun this script"
    exit -1
fi

# Copy from Dev environment
cp -rf ${DEV_DIR}/* -t ${SCRIPT_DIR}
# Remove/Resotre files
rm -rf Gemfile* local_debug.sh setup_ruby_ubuntu.sh _site _dev
git restore README.md

