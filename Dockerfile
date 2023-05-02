FROM hmctspublic.azurecr.io/base/node:14-alpine as base

USER root
RUN corepack enable

USER hmcts

COPY --chown=hmcts:hmcts .yarn  ./.yarn
COPY --chown=hmcts:hmcts config ./config
COPY --chown=hmcts:hmcts package.json yarn.lock .yarnrc.yml ./

RUN yarn workspaces focus --all --production && yarn cache clean

#---------- BUILD IMAGE---------------
FROM base as build
COPY --chown=hmcts:hmcts . ./


EXPOSE 3000
