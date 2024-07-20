FROM node:20.11.1-alpine

WORKDIR /usr/

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5500

CMD ["npm", "run","dev"]