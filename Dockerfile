FROM hmctspublic.azurecr.io/base/node:18-alpine as base
FROM base as build

USER root
RUN apk add python3 make g++
USER hmcts

COPY --chown=hmcts:hmcts . .
RUN yarn install && yarn build && rm -r node_modules/ && yarn install --production && rm -r ~/.cache/yarn

FROM base as runtime
COPY --from=build $WORKDIR ./
USER hmcts
EXPOSE 3000