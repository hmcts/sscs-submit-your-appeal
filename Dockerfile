FROM hmctspublic.azurecr.io/base/node:16-alpine as base

COPY --chown=hmcts:hmcts . .
RUN yarn install && rm -r node_modules/ && yarn install --production && rm -r ~/.cache/yarn

USER hmcts
EXPOSE 3000
