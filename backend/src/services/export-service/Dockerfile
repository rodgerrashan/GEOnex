FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5006
ENV NODE_ENV=production
CMD ["node", "index.js"]