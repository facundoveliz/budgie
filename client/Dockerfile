# install dependencies
FROM node:lts-alpine AS deps
WORKDIR /app
COPY package*.json .
RUN npm install --force

# build
FROM node:lts-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . ./
COPY public ./public
COPY package.json next.config.js ./

RUN npm run build

# run
FROM node:lts-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
CMD ["npm", "run", "start"]
