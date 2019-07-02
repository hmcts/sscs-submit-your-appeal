FROM node:chakracore-8.11.1

ENV NODE_PATH .
ENV NODE_ENV development

WORKDIR /usr/src/sya

RUN yarn config set proxy "$http_proxy" \
    && yarn config set https-proxy "$https_proxy"

COPY package.json yarn.lock ./

RUN yarn install --production && yarn cache clean

COPY . .

CMD [ "node", "server.js" ]
