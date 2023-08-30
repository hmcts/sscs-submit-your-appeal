# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:14-alpine as base
USER root
RUN corepack enable
USER hmcts

COPY --chown=hmcts:hmcts .yarn ./.yarn
COPY --chown=hmcts:hmcts config ./config
COPY --chown=hmcts:hmcts package.json yarn.lock .yarnrc.yml ./

USER root
RUN apk add py3-pip
RUN apk add gcc musl-dev python3-dev libffi-dev openssl-dev cargo make
RUN pip install --upgrade pip
RUN pip install azure-cli

USER root
RUN mkdir -p ./scripts
COPY loadServerConfig.sh ./scripts
RUN chmod +x ./scripts/loadServerConfig.sh
RUN az login --use-device-code
RUN az acr login -n hmctspublic --expose-token
RUN ./scripts/loadServerConfig.sh



RUN yarn workspaces focus --all --production && yarn cache clean

# ---- Build image ----
FROM base as build
COPY --chown=hmcts:hmcts . ./
RUN yarn install
RUN yarn build

USER root
RUN apk --update add redis curl
USER hmcts




USER root
RUN mkdir -p ./scripts
COPY loadServerConfig.sh ./scripts
RUN chmod +x ./scripts/loadServerConfig.sh
RUN ./scripts/loadServerConfig.sh



EXPOSE 3000

