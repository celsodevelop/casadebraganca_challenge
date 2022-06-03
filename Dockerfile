FROM node:16.15

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
ENV HOME=/home/node/

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=/home/node/.npm-global/bin:${PATH}

RUN npm i --unsafe-perm -g npm@8.12.1 ts-node-dev@2.0

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

RUN chown -R node:node $(npm config get prefix)/lib/node_modules
RUN chown -R node:node /usr/local/bin


WORKDIR /home/node/app

COPY package*.json ./

RUN apt-get update
USER node

RUN npm install -D

ENV PATH=/home/node/app/node_modules/.bin:${PATH}

COPY --chown=node:node . .

EXPOSE 5000
