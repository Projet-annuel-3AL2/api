FROM node:16-alpine3.11
EXPOSE 4500
WORKDIR /usr/src/app
COPY . .
RUN npm install npm@7
RUN npm install --only=production
RUN npm run build
CMD npm run start
