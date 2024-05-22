FROM node:20.12.2 as builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY . .
RUN npm install
RUN npm run build
EXPOSE 8082
CMD ["npm", "run", "dev"]