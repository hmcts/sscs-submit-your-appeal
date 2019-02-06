FROM hmcts.azurecr.io/hmcts/base/node/stretch-slim-lts-8:latest

ENV NODE_PATH .
ENV NODE_ENV development

RUN yarn config set proxy "$http_proxy" \
    && yarn config set https-proxy "$https_proxy"

COPY package.json yarn.lock ./

RUN yarn install --production && yarn cache clean

COPY . .

CMD [ "node", "server.js" ]
