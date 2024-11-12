# Use Node.js image
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

# Copy the rest of the files
COPY . .

# Expose the port
EXPOSE 8080

# Build
RUN npm run build

# Define the command to run your app
CMD ["npm", "start"]