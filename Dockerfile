# Docker image
FROM keymetrics/pm2:latest-alpine

# Set environmet variable
ENV SERVER_HOST=0.0.0.0
ENV SERVER_PORT=9090
ENV TFS_PROJECT=${TFS_PROJECT}
ENV TFS_URL=${TFS_URL}
ENV TFS_USER_TOKEN=${TFS_USER_TOKEN}

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Build code for production
RUN npm ci

# Copy app source from host into container
COPY . .

# Expose some port
EXPOSE ${SERVER_PORT}

# Run application
CMD [ "npm", "start" ]
