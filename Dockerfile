FROM hmctspublic.azurecr.io/base/node:14-alpine as base

USER root
RUN corepack enable

COPY --chown=hmcts:hmcts . .
USER hmcts
# RUN yarn install && yarn build && yarn cache clean
RUN yarn install && yarn build && rm -r node_modules/ && yarn install --production && rm -r ~/.cache/yarn

EXPOSE 3000
