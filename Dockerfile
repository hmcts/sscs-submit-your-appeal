# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:14-alpine as base
USER root
RUN corepack enable
USER hmcts

COPY --chown=hmcts:hmcts .yarn ./.yarn
COPY --chown=hmcts:hmcts config ./config
COPY --chown=hmcts:hmcts package.json yarn.lock .yarnrc.yml ./



USER root
RUN mkdir ./scripts
COPY loadServerConfig.sh ./
RUN chmod +x loadServerConfig.sh
CMD ["./loadServerConfig.sh"]


RUN yarn workspaces focus --all --production && yarn cache clean

# ---- Build image ----
FROM base as build
COPY --chown=hmcts:hmcts . ./
RUN yarn install
RUN yarn build

USER root
RUN apk --update add redis curl
USER hmcts

RUN if [ ! -f "/scripts/loadServerConfig.sh" ];  \
        then \
            echo "Folder or script not found, creating them..."; \
            USER root; \
            mkdir ./scripts; \
            copy loadServerConfig.sh ./scripts ;\
            RUN chmod +x loadServerConfig.sh; \
            ./loadServerConfig.sh; \
    else \
      echo "Folder and file already exist..."; \
    fi


EXPOSE 3000

