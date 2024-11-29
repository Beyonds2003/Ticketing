FROM node:18.20.2-alpine

WORKDIR /app
COPY package.json ./
RUN npm install --loglevel verbose
COPY ./ ./

CMD ["npm", "start"]
