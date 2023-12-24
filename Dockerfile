# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . . 

# Expose a port (if your Node.js server listens on a specific port)
EXPOSE 9090

# Specify the command to run your application
CMD ["npm", "start"]