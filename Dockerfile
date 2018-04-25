FROM node:8.9.4-alpine

ENV NODE_PATH .
ENV NODE_ENV development

RUN mkdir -p /usr/src/sya
WORKDIR /usr/src/sya

COPY . /usr/src/sya/

RUN yarn config set proxy "$http_proxy" \
 && yarn config set https-proxy "$https_proxy"

RUN rm -rf node_modules
RUN yarn install --production && yarn cache clean

CMD [ "node", "server.js" ]
