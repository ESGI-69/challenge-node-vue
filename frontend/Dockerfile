FROM node:lts-alpine

ARG VITE_API
ENV VITE_API=https://challenge-2023-backend.mrpink.dev
ARG VITE_API_TIMEOUT
ENV VITE_API_TIMEOUT=30000
ARG VITE_COOKIE_TOKEN_NAME
ENV VITE_COOKIE_TOKEN_NAME=challenge-token

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
