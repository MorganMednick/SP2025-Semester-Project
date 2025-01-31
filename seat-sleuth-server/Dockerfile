FROM node:18-alpine


WORKDIR /app

RUN apk add --no-cache curl

COPY package*.json ./


RUN npm install


COPY . .


RUN npx prisma generate


CMD ["npm", "run", "dev"]


EXPOSE 4000
EXPOSE 5555
