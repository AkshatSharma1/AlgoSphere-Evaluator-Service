# Use an official Node.js 18 slim image as the base.
# It's a lightweight version, perfect for production.
FROM node:18-slim

# Set the working directory inside the container.
# All subsequent commands will run from this directory.
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files first.
# This leverages Docker's layer caching. If these files don't change,
# Docker won't re-run 'npm install' on subsequent builds, making them faster.
COPY package*.json ./

# Install all production dependencies.
RUN npm install --omit=dev

# Copy the rest of your application's source code into the container.
COPY . .

# Your service is written in TypeScript, so we need to compile it to JavaScript.
# The 'build' script in your package.json should run 'tsc'.
RUN npm run build

# Expose the port that your service listens on inside the container.
EXPOSE 5000

# This is the command that will be run to start your service when the container starts.
# It runs the compiled JavaScript from the 'dist' directory.
CMD [ "npm", "start" ]