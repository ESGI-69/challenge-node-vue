FROM node:lts-alpine

# Install bcryp
RUN apk add --no-cache --virtual .build-deps alpine-sdk python \
    && npm install --quiet node-gyp -g \
    && npm install --quiet bcrypt --save \
    && apk del .build-deps

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose port and start application
EXPOSE 3000
CMD ["npm", "start"]
