#!/bin/bash
set -ue

set -x


function shutdownDocker() {
  docker-compose -f docker-compose.smoke-tests.yml down
}


trap shutdownDocker INT TERM QUIT EXIT

docker-compose --version


docker-compose -f docker-compose.smoke-tests.yml run syatests
docker-compose -f docker-compose.smoke-tests.yml down
