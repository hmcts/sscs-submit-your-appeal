FROM hmctspublic.azurecr.io/base/node:18-alpine as base
FROM base as build

RUN apk add git python make g++

COPY --chown=hmcts:hmcts . .
RUN yarn install && yarn build && rm -r node_modules/ && yarn install --production && rm -r ~/.cache/yarn

FROM base as runtime
COPY --from=build $WORKDIR ./
USER hmcts
EXPOSE 3000