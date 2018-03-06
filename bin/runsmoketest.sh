#!/bin/bash
set -ue

set -x


function shutdownDocker() {
  docker-compose -f docker-compose.smoke-tests.yml down
}


trap shutdownDocker INT TERM QUIT EXIT

docker-compose --version


if [[ ${TEST_URL} == *"aat.internal" ]]; then

  cat "${TEST_URL} benefit-appeal.nonprod.platform.hmcts.net" > hosts
  EXPORT ACTUAL_TEST_URL="https://benefit-appeal.nonprod.platform.hmcts.net"

elif [[ ${TEST_URL} == *"prod.internal" ]]; then

  cat "${TEST_URL} benefit-appeal.platform.hmcts.net" > hosts
  EXPORT ACTUAL_TEST_URL="https://benefit-appeal.platform.hmcts.net"
  
elif [[ ${TEST_URL} == *"sandbox.internal" ]]; then

  cat "${TEST_URL} benefit-appeal.demo.platform.hmcts.net/" > hosts
  EXPORT ACTUAL_TEST_URL="https://benefit-appeal.demo.platform.hmcts.net/"
else
  EXPORT ACTUAL_TEST_URL=${TEST_URL}
fi

docker-compose -f docker-compose.smoke-tests.yml run syatests
docker-compose -f docker-compose.smoke-tests.yml down
