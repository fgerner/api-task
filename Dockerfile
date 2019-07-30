FROM node:7.8-slim

WORKDIR /app

COPY package.json ./

RUN npm i -g mocha mocha-jenkins-reporter
RUN npm --allow-root install

COPY . ./

ENTRYPOINT ["./entrypoint.sh"]