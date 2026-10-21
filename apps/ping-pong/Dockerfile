FROM node:26-alpine

RUN apk upgrade --no-cache

WORKDIR /app

COPY package.json index.js ./

ENV PORT=3000
EXPOSE 3000

CMD ["node", "index.js"]
