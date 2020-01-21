# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:10-alpine as base
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

EXPOSE 3000
CMD ["npm", "start"]
