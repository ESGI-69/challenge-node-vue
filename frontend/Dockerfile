FROM node:lts-alpine

# install simple http server for serving static content
RUN npm install -g http-server

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Build app
RUN npm run build

# Expose port and start application
EXPOSE 8080
CMD ["http-server", "--proxy", "http://localhost:8080?", "dist"]
