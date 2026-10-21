FROM node:26-alpine

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN apk upgrade --no-cache \
    && npm install -g corepack \
    && corepack enable

WORKDIR /repo

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml .npmrc ./
COPY apps/todo-app ./apps/todo-app

RUN pnpm install --frozen-lockfile --filter todo-app

WORKDIR /repo/apps/todo-app

EXPOSE 3000

CMD ["node", "index.js"]
