FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build
CMD [ "npm", "start" ]
