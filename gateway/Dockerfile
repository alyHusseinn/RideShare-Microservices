FROM node:22.12.0-alpine3.20 AS build

RUN mkdir -p /app/node_modules && \
    chown -R node:node /app

WORKDIR /app

RUN npm install -g pnpm
COPY package*.json pnpm-lock.yaml ./

USER node

RUN pnpm install --frozen-lockfile

COPY --chown=node:node . .

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN pnpm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]