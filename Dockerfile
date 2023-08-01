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
#RUN apk add --no-cache --update python3 py3-pip
#RUN apk add --no-cache --update --virtual=build gcc musl-dev python3-dev libffi-dev openssl-dev cargo make && pip3 install --no-cache-dir --prefer-binary azure-cli && apk del virtual

USER root
RUN mkdir -p ./opt/app/scripts
COPY loadServerConfig.sh ./opt/app/scripts
RUN chmod +x ./opt/app/scripts/loadServerConfig.sh
RUN ./opt/app/scripts/loadServerConfig.sh



RUN yarn workspaces focus --all --production && yarn cache clean

# ---- Build image ----
FROM base as build
COPY --chown=hmcts:hmcts . ./
RUN yarn install
RUN yarn build

USER root
RUN apk --update add redis curl
USER hmcts

USER ROOT


USER root
RUN mkdir -p ./opt/app/scripts
COPY loadServerConfig.sh ./opt/app/scripts
RUN chmod +x ./opt/app/scripts/loadServerConfig.sh
RUN ./opt/app/scripts/loadServerConfig.sh

#RUN if [ ! -f "/opt/app/scripts/loadServerConfig.sh" ]; then \
#          echo "Folder or script not found, creating them..."
##            USER root; \
#          mkdir -p ./opt/app/scripts; \
#          cp loadServerConfig.sh ./opt/app/scripts; \
#          RUN chmod +x /opt/app/scripts/loadServerConfig.sh \
#          USER root; \
#          RUN mkdir ./opt/app/scripts; \
##            USER root; \
##            RUN mkdir ./opt/app/scripts; \
#          COPY loadServerConfig.sh ./opt/app/scripts ; \
#          RUN chmod +x opt/app/scripts/loadServerConfig.sh; \
#            ./opt/app/scripts/loadServerConfig.sh; \
#    else \
#      echo "Folder and file already exist..."; \
#    fi


EXPOSE 3000

