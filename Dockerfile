FROM node:8.15.1-stretch-slim as base

ENV NODE_PATH .
ENV NODE_ENV development

ENV WORKDIR /opt/app
WORKDIR ${WORKDIR}

COPY package.json yarn.lock ./

RUN yarn config set proxy "$http_proxy" \
    && yarn config set https-proxy "$https_proxy"

# ---- Build image ----
FROM base as build
RUN apt-get update \
    && apt-get install --assume-yes git bzip2

COPY . ./

RUN yarn install --production \
    && yarn cache clean \
    && rm -rf /opt/app/.git

# ---- Runtime image ----
FROM base as runtime
COPY --from=build ${WORKDIR}/config config/
COPY --from=build ${WORKDIR}/server.js ${WORKDIR}/app.js  ./

EXPOSE 3000

CMD ["node", "server.js" ]


