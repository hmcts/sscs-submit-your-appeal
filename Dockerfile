FROM hmctspublic.azurecr.io/base/node:14-alpine as base

USER root
RUN corepack enable

COPY --chown=hmcts:hmcts . .
RUN yarn install && yarn build && yarn cache clean --all

USER hmcts
EXPOSE 3000
