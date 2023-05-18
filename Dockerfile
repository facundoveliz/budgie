FROM node
WORKDIR /usr/app
COPY package*.json yarn.lock ./

RUN yarn install
COPY . ./

RUN yarn run build

WORKDIR ./dist/
CMD node server.js
