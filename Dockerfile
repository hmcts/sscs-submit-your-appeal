# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:14-alpine as base

USER root
RUN corepack enable
USER hmcts

COPY --chown=hmcts:hmcts .yarn ./.yarn
COPY --chown=hmcts:hmcts config ./config
COPY --chown=hmcts:hmcts package.json yarn.lock .yarnrc.yml ./

RUN yarn workspaces focus --all && yarn cache clean

# ---- Build image ----
FROM base as build
COPY --chown=hmcts:hmcts . ./
RUN yarn install
COPY gulpfile.js server.js ./
RUN yarn build

# ---- Runtime image ----
COPY config ./config
EXPOSE 3000






