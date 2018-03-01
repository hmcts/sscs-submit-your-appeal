FROM node:8.9.1

ENV NODE_PATH .
ENV NODE_ENV development

RUN mkdir -p /usr/src/sya
WORKDIR /usr/src/sya

COPY package.json yarn.lock app.js /usr/src/sya/
RUN  yarn install && yarn cache clean

COPY assets /usr/src/sya/assets
COPY config /usr/src/sya/config
COPY steps /usr/src/sya/steps
COPY utils /usr/src/sya/utils
COPY views /usr/src/sya/views

EXPOSE 3000
CMD [ "yarn", "start-dev" ]
