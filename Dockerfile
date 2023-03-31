FROM hmctspublic.azurecr.io/base/node:18-alpine as base

COPY package.json yarn.lock ./

FROM base as build

USER root
RUN apk add python2 make g++
USER hmcts

RUN yarn && npm rebuild node-sass

COPY . .
RUN yarn setup && rm -r node_modules/ && yarn install --production && rm -r ~/.cache/yarn

FROM base as runtime
COPY --from=build $WORKDIR ./
USER hmcts
EXPOSE 3000