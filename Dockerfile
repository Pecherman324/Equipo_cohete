# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app

COPY app/package.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY app/src ./src
COPY app/public ./public

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "src/index.js"]


