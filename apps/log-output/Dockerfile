FROM node:26-alpine

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN apk upgrade --no-cache \
    && npm install -g corepack \
    && corepack enable

WORKDIR /repo

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml .npmrc ./
COPY apps/log-output ./apps/log-output

RUN pnpm install --frozen-lockfile --filter log-output

WORKDIR /repo/apps/log-output

EXPOSE 3000

CMD ["node", "index.js"]
