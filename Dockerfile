# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node/stretch-slim-lts-8:8-stretch-slim as base
RUN yarn config set proxy "$http_proxy" && yarn config set https-proxy "$https_proxy"
COPY package.json yarn.lock ./
RUN yarn install --production \
  && yarn cache clean

# ---- Build image ----
FROM base as build
COPY . ./
RUN yarn install
COPY --chown=hmcts:hmcts * ./
RUN yarn setup

# ---- Runtime image ----
FROM base as runtime
COPY --from=build $WORKDIR/ ./
COPY --from=build $WORKDIR/server.js ./
COPY --from=build $WORKDIR/config ./config
COPY --from=build $WORKDIR/components ./components
#COPY --from=build $WORKDIR/middleware ./middleware
#COPY --from=build $WORKDIR/policy-pages ./policy-pages
#COPY --from=build $WORKDIR/services ./services
#COPY --from=build $WORKDIR/steps ./steps
#COPY --from=build $WORKDIR/utils ./utils
#COPY --from=build $WORKDIR/views ./views
#COPY --from=build $WORKDIR/webpack ./webpack \
#    $WORKDIR/server.js \
#    $WORKDIR/app.js \
#    $WORKDIR/appConfigurations.js \
#    $WORKDIR/content.en.json \
#    $WORKDIR/logger.js \
#    $WORKDIR/steps.js \
#    $WORKDIR/urls.js \
#    $WORKDIR/paths.js \
#    ./
EXPOSE 3000
CMD ["npm", "start"]