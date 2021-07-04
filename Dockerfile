FROM node:14-alpine
EXPOSE 4500
WORKDIR /usr/src/app
COPY . .
RUN npm install -g npm
RUN npm install --only=production
RUN npm run build
CMD npm run start
