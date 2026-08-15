# ── ステージ1: ビルド（TypeScript → JavaScript） ──────────
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── ステージ2: 実行（ビルド成果物と本番用依存だけを載せる） ──
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser
USER appuser
EXPOSE 3001
CMD ["node", "dist/main.js"]
