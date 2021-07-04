EXPOSE 4500
FROM nginx:1.17.1-alpine
WORKDIR /usr/src/app
COPY . .
RUN npm install --only=production
RUN npm run build
CMD npm run start
