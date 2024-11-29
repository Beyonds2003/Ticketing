FROM node:18.20.2-alpine

RUN npm install -g pnpm

WORKDIR /app
COPY package.json ./
RUN pnpm install --loglevel verbose
COPY ./ ./

CMD ["pnpm", "run", "dev"]
