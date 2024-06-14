# Use a base Node.js image
FROM amd64/node:22.2.0-bullseye-slim
#FROM node:16-bullseye-slim  for windows Container
# Set the working directory in the container
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . /usr/src/app

# Expose the port on which your Express app runs
EXPOSE 3000

# Command to run your Node.js application
CMD ["npm", "run", "server"]