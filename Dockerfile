FROM node:14-alpine
RUN apk add g++ make python
EXPOSE 4500
WORKDIR /usr/src/app
COPY . .
RUN npm install -g npm
RUN npm install
CMD npm run start
