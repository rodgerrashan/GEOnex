# Use official Node.js runtime as base image (Alpine for smaller size)
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application source code
COPY . .

# Set environment variables
ENV NODE_ENV=production \
    PORT=5000 \
    DOCKER_ENV=true

# Expose port 5000
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
