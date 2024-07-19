FROM node:20.11.1-alpine

WORKDIR /usr/src/

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 6000

CMD ["npm", "start"]
