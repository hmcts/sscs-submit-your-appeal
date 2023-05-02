FROM hmctspublic.azurecr.io/base/node:14-alpine as base

USER root
RUN corepack enable

COPY --chown=hmcts:hmcts . .
USER hmcts
RUN yarn install  && yarn build && yarn cache clean

EXPOSE 3000
