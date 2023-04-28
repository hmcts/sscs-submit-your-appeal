FROM hmctspublic.azurecr.io/base/node:14-alpine as base

COPY --chown=hmcts:hmcts . .
RUN yarn install && yarn build && rm -r node_modules/ && yarn install --production && rm -r ~/.cache/yarn

USER ROOT
RUN corepack enable
EXPOSE 3000


