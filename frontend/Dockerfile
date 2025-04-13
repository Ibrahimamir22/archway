FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies - single layer for better caching
RUN npm ci --no-optional && \
    # Ensure critical packages are installed even if npm ci fails
    npm list react-query || npm install --save react-query && \
    npm list react-icons || npm install --save react-icons && \
    npm list i18next framer-motion react-i18next || npm install --save i18next framer-motion react-i18next && \
    npm list tailwindcss-rtl || npm install --save tailwindcss-rtl && \
    npm list @types/react-query || npm install --save-dev @types/react-query

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