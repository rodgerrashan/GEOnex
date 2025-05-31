# Use Node.js base image
FROM node:22

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port the gateway runs on
EXPOSE 5000

# Start the gateway
CMD ["node", "server.js"]
