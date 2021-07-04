FROM node
EXPOSE 4500
WORKDIR /usr/src/app
COPY . .
RUN npm install --only=production
RUN npm run build
CMD npm run start
