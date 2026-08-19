# ---------- Stage 1: Build ----------
FROM node:24-alpine AS builder

WORKDIR /app

# Copy only dependency manifests first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy rest of the source and build
COPY . .
RUN npm run build

# ---------- Stage 2: Production ----------
FROM node:24-alpine

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json /app/package-lock.json ./

# Install production dependencies only (no devDependencies)
RUN npm ci --omit=dev

# Expose the port the app runs on
EXPOSE 3000

# Run the server
CMD ["node", "dist/index.js"]