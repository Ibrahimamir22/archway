FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application files
COPY . .

# Set environment variables for Next.js in Docker
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0

# Expose port
EXPOSE 3000

# Start the development server with hot reloading
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"] 