# Stage 1: Base Image
FROM node:20-alpine AS base
WORKDIR /app
# Create a non-root user and group for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S -u 1001 -G nodejs nextjs
# Set base NODE_ENV
ENV NODE_ENV production

# Stage 2: Install Dependencies
FROM base AS deps
WORKDIR /app
# Copy dependency definition files
COPY package.json package-lock.json* ./
# Install all dependencies including devDependencies
RUN npm ci

# Stage 3: Build Application
# Build the Next.js application using production dependencies
FROM base AS builder
WORKDIR /app
# Copy dependencies from the 'deps' stage
COPY --from=deps /app/node_modules ./node_modules
# Copy application code
COPY . .
# Build the Next.js application
# Ensure NEXT_PUBLIC_ variables are available if needed during build
# ARG NEXT_PUBLIC_API_URL NEXT_PUBLIC_BACKEND_URL ...
# ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL ... (if needed)
RUN npm run build
# Optional: Prune development dependencies for a smaller production image
# RUN npm prune --production

# Stage 4: Development Setup
FROM base AS development
ENV NODE_ENV development
WORKDIR /app
# Copy node_modules from the 'deps' stage (includes devDependencies)
COPY --from=deps /app/node_modules ./node_modules
# Copy package.json to ensure scripts are available
COPY package.json .
# Fix permissions for node_modules 
RUN chown -R nextjs:nodejs /app/node_modules
# Expose port for development server
EXPOSE 3000
# For development, run as root to avoid permission issues with mounted volumes
# Default command for development (source code mounted via volume)
CMD ["npm", "run", "dev"]

# Stage 5: Production Setup
FROM base AS production
WORKDIR /app

# Copy necessary files from builder stage
COPY --from=builder /app/package.json ./package.json
# Alternatively, install only production deps here if builder stage pruned them:
# RUN npm ci --omit=dev

# Copy built application artifacts and dependencies
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules 
COPY --from=builder /app/public ./public
# Copy runtime config files needed by `next start` individually
COPY --from=builder /app/next.config.js ./next.config.js 
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Ensure correct ownership (important if previous COPY commands didn't use --chown)
RUN chown -R nextjs:nodejs /app/.next /app/node_modules /app/public ./next.config.js ./tsconfig.json

# Switch to non-root user
USER nextjs

# Expose port for production server
EXPOSE 3000
ENV PORT 3000 # Set port env var for `next start`

# Command to run the production server
CMD ["npm", "run", "start"] 