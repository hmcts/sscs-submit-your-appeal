FROM hmcts.azurecr.io/hmcts/base/node/stretch-slim-lts-8:latest as base

ENV NODE_PATH .
ENV NODE_ENV development

RUN yarn config set proxy "$http_proxy" \
    && yarn config set https-proxy "$https_proxy"

COPY package.json yarn.lock ./

RUN yarn install --production && yarn cache clean

COPY . .

USER hmcts

CMD [ "node", "server.js" ]
