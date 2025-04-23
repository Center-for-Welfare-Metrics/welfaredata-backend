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
    libcairo2 \
    libexpat1 \
    libfontconfig1 \
    libxdamage1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libx11-6 \
    libxau6 \
    libxrender1 \
    libxtst6 \
    libxrandr2 \
    libxss1 \
    libxshmfence1 \
    xdg-utils \
    --no-install-recommends && \
    TARGET=$(which chromium || which chromium-browser) && \
    [ "$TARGET" = "/usr/bin/chromium" ] || ln -sf "$TARGET" /usr/bin/chromium && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./

EXPOSE 8080

CMD ["node", "dist/bin/server.js"]
