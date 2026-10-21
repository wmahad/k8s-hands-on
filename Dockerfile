FROM node:26-alpine

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN apk upgrade --no-cache \
    && npm install -g corepack \
    && corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY index.js ./

ENV PORT=3000
EXPOSE 3000

CMD ["pnpm", "start"]
