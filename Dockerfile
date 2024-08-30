# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:18-alpine as base
USER root
RUN corepack enable
USER hmcts

COPY --chown=hmcts:hmcts .yarn ./.yarn
COPY --chown=hmcts:hmcts config ./config
COPY --chown=hmcts:hmcts package.json yarn.lock .yarnrc.yml ./

ENV NODE_OPTIONS=--openssl-legacy-provider
ENV PUPPETEER_SKIP_DOWNLOAD=true

RUN yarn workspaces focus --all --production && yarn cache clean

# ---- Build image ----
FROM base as build
COPY --chown=hmcts:hmcts . ./
RUN yarn build

USER root
RUN apk --update add redis curl
USER hmcts

EXPOSE 3000

