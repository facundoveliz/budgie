FROM node:lts-alpine AS deps
WORKDIR /app
COPY package*.json .
RUN npm install --force

FROM node:lts-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . ./
COPY public ./public
COPY package.json next.config.js ./

RUN npm run build
RUN npm run export
