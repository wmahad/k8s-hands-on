FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY index.js ./

ENV PORT=3000
EXPOSE 3000

CMD ["pnpm", "start"]
