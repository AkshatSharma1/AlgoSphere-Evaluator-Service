# --- Stage 1: Build Stage ---
# This stage has one job: compile your TypeScript into JavaScript.
FROM node:18-slim AS build

WORKDIR /usr/src/app
COPY package*.json ./

# Here, we install ALL dependencies, including "typescript" from devDependencies.
RUN npm install

COPY . .

# We run your "build" script ('tsc') to create the 'dist' folder.
RUN npm run build


# --- Stage 2: Production Stage ---
# This is the final, clean container that will actually run on the server.
FROM node:18-slim

WORKDIR /usr/src/app
COPY package*.json ./

# Now, we install ONLY production dependencies. This makes the container smaller.
RUN npm install --omit=dev

# Copy the compiled 'dist' folder from the 'build' stage.
COPY --from=build /usr/src/app/dist ./dist

# The port your server listens on.
EXPOSE 5000

# Run your "start" script ('node dist/index.js') to start the server.
CMD [ "npm", "start" ]