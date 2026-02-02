# Use the official Bun image
FROM oven/bun:1 as base
WORKDIR /app

# Install dependencies (incorporating cache)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the app
RUN bun run build

# Production stage - simplified for static serving using Bun's built-in server or just 'serve'
# Since Bun can serve static files, we can write a tiny script or use 'bun x serve'
# Let's use a lightweight approach: serve the dist folder
CMD ["bun", "x", "serve", "dist", "-p", "8080"]

EXPOSE 8080
