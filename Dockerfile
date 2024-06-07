FROM node:14
# Create and change to the app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
RUN npm install
# Copy the app's source code to the container
COPY . .
# Expose the port the app runs on      C:\Users\S0001413\Desktop\PFE\mocky\Dockerfile
EXPOSE 3333
# Run the app
CMD ["npm", "start"]