FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 4000

ENTRYPOINT [ "npm", "run", "start" ]
