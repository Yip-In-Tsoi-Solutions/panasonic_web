# Use a base Node.js image
FROM node:20-alpine

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
EXPOSE 80

# Command to run your Node.js application
CMD ["npm", "run", "server"]
