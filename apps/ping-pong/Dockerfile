FROM node:26-alpine

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN apk upgrade --no-cache \
    && npm install -g corepack \
    && corepack enable

WORKDIR /repo

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml .npmrc ./
COPY apps/ping-pong ./apps/ping-pong

RUN pnpm install --frozen-lockfile --filter ping-pong

WORKDIR /repo/apps/ping-pong

ENV PORT=3000
EXPOSE 3000

CMD ["node", "index.js"]
