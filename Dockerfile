FROM node:8.9.4-slim

ENV NODE_PATH .
ENV NODE_ENV development

RUN mkdir -p /usr/src/sya
WORKDIR /usr/src/sya

COPY . /usr/src/sya/

RUN yarn config set proxy "$http_proxy" \
 && yarn config set https-proxy "$https_proxy"

RUN yarn install --production && yarn cache clean

CMD [ "node", "server.js" ]
