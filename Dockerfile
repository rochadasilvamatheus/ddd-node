# Use the official Node.js image as a base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for installing dependencies
COPY package*.json ./

# Install the Node.js dependencies
RUN npm install

# Copy all the application files into the container
COPY . .

# Expose the port your app will run on
EXPOSE 3000

