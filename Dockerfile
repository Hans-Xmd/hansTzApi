# Use Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install && npm install ytdl-core

# Copy all project files
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
