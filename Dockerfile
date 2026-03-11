# Use Node LTS
FROM node:24

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Run app
CMD ["npm", "start"]