#!/bin/bash

function removeFolders {
    if test -e client/src; then 
        rm -r client/src
    fi

    if test -e server/src; then
        rm -r server/src
    fi
}

GREEN='\033[0;32m'
NC='\033[0m'

printf "${GREEN}Try to remove olf files in the docker container\n\n${NC}"
removeFolders

printf "${GREEN}Copy src files in the docker folder\n\n${NC}"
mkdir client/src
mkdir server/src

cp -r ../../client/package*.json client/src
cp -r ../../client/public client/src
cp -r ../../client/src client/src
cp -r ../../client/tsconfig*.json client/src

cp -r ../../server/package*.json server/src
cp -r ../../server/src server/src
cp -r ../../server/tsconfig*.json server/src


printf "${GREEN}Build docker compose\n\n${NC}"
docker-compose build --no-cache

removeFolders