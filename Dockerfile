FROM node:lts-alpine3.21


WORKDIR /app
COPY package*.json .

RUN npm install


COPY . .

# install prisma 
# RUN npm run prisma:init
RUN npm run prisma:generate

RUN npm run build

EXPOSE 4000 

CMD ["npm", "start"]

