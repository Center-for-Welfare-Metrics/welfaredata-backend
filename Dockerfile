# Build stage
FROM node:22-slim AS build

WORKDIR /usr/src/app

COPY package*.json ./
COPY . .

RUN npm install
RUN npm run build
RUN npm prune --production

# Final stage
FROM node:22-slim

# Instala Chromium e dependências necessárias
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libxshmfence1 \
    xdg-utils \
    --no-install-recommends && \
    ln -s $(which chromium || which chromium-browser) /usr/bin/chromium && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copia apenas o necessário
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./

EXPOSE 8080

CMD ["node", "dist/bin/server.js"]
