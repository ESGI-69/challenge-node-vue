FROM node:lts-alpine

ARG VITE_API=http://challenge-2023-backend.mrpink.dev
ENV VITE_API=$VITE_API
ARG VITE_API_TIMEOUT=30000
ENV VITE_API_TIMEOUT=$VITE_API_TIMEOUT
ARG VITE_COOKIE_TOKEN_NAME=challenge-token
ENV VITE_COOKIE_TOKEN_NAME=$VITE_COOKIE_TOKEN_NAME

# install git
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

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
CMD ["http-server", "-c-1", "--proxy", "http://localhost:8080?", "dist"]
