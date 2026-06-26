# Use an official Node runtime as a parent image
FROM node:20-alpine

# Install openssl (Required by Prisma on Alpine Linux)
RUN apk add --no-cache openssl

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy prisma schema so that postinstall scripts can find it
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the TypeScript code
RUN npm run build

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application in development mode
# For production, you might want to use "npm start" after building
CMD ["npm", "run", "dev"]
