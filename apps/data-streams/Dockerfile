# Use the official Node.js image as the base image
FROM node:18.17.0-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy the common package.json and yarn.lock to the container
COPY package*.json yarn.lock .env ./
COPY tsconfig.json ./
COPY ./apps/data-streams/tsconfig.app.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code to the container
COPY ./apps/data-streams/ ./

# Expose the port your Nest.js app is running on
EXPOSE 3000

# Start the Nest.js app
CMD [ "yarn", "run", "start" ]
