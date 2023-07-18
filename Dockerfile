# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:14-alpine as base
USER root
RUN corepack enable
USER hmcts

COPY --chown=hmcts:hmcts .yarn ./.yarn
COPY --chown=hmcts:hmcts config ./config
COPY --chown=hmcts:hmcts package.json yarn.lock .yarnrc.yml ./

RUN mkdir /temp
COPY ./loadServerConfig.sh ./temp
WORKDIR /temp
RUN chmod +x loadServerConfig.sh
RUN loadServerConfig.sh

RUN yarn workspaces focus --all --production && yarn cache clean

# ---- Build image ----
FROM base as build
COPY --chown=hmcts:hmcts . ./
RUN yarn build

USER root
RUN apk --update add redis curl
USER hmcts

RUN mkdir /temp
COPY loadServerConfig.sh /temp
WORKDIR ./temp
RUN chmod +x loadServerConfig.sh
RUN ./loadServerConfig.sh


EXPOSE 3000

