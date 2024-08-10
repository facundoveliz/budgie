FROM node:lts-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

# EXPOSE $SERVER_PORT
# ENV PORT=$SERVER_PORT

WORKDIR ./dist/
CMD node server.js
CMD ["node", "server.js"]
