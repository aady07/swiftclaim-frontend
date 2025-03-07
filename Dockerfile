# Use official Node.js image as base
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for caching dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project (after installing dependencies to speed up builds)
COPY . .

# ---- Development Stage ----
FROM base AS development
# Expose Vite's default dev port
EXPOSE 5173
# Start in development mode
CMD ["npm", "run", "dev"]

# ---- Production Stage ----
#FROM base AS production
# Build the production app
#RUN npm run build
# Expose Vite's preview server port
#EXPOSE 4173
# Start the production preview
#CMD ["npm", "run", "preview"]
