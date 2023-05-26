FROM node:20-alpine

# install curl for healthcheck
RUN apk add --no-cache curl

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code from backend directory
COPY . .

# Set healthcheck
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 CMD curl -f http://localhost:3000/health || exit 1

# Expose port and start application
EXPOSE 3000
CMD ["npm", "start"]
