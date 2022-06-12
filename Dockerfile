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

# Yeah, we will need docker inside docker to deal with our
# test environment

RUN curl -fsSL https://get.docker.com -o get-docker.sh
RUN sh ./get-docker.sh
RUN usermod -aG docker node

WORKDIR /home/node/app

COPY package*.json ./

# We need it to expose docker.sock from our host
# binding volume will help to replicate inside container
# docker.sock will be binded only for test purposes and
# this approach have security warns, it's here only to
# support test suite ecosystem using @databases/pg-test

RUN touch /var/run/docker.sock
RUN chown -R node:node /var/run/docker.sock
RUN apt install acl
RUN setfacl --modify user:node:rw /var/run/docker.sock

# WARNING: Change the number 998 below to your docker GID
# you may experience some operation not permitted error
# if not change

RUN groupmod -g 998 docker
USER node

RUN npm install -D

ENV PATH=/home/node/app/node_modules/.bin:${PATH}

COPY --chown=node:node . .

EXPOSE 5000
