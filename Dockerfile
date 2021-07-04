FROM node:14
EXPOSE 4500
WORKDIR /usr/src/app
COPY . .
RUN npm install -g npm
RUN npm install
CMD npm run start
