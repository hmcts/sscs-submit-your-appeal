# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:14-alpine as base

USER root
RUN corepack enable
USER hmcts

COPY --chown=hmcts:hmcts .yarn ./.yarn
COPY --chown=hmcts:hmcts config ./config
COPY --chown=hmcts:hmcts package.json yarn.lock .yarnrc.yml ./

RUN yarn workspaces focus --all --production && yarn cache clean

# ---- Build image ----
FROM base as build
COPY --chown=hmcts:hmcts . ./
RUN PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true yarn install --immutable
COPY gulpfile.js server.js ./
RUN yarn build

# ---- Runtime image ----
FROM base as runtime
COPY --chown=hmcts:hmcts . ./
COPY services ./services
EXPOSE 3000








