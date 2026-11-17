# Imagen de producción para Dokploy (Next.js en modo standalone).
FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app

# Dependencias (se cachean mientras no cambie el lockfile).
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Compilación. Sin DATABASE_URL el build usa los archivos de content/;
# en ejecución el sitio lee el blog desde Neon y se actualiza con ISR.
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# Ejecución: solo el servidor compilado, los archivos públicos y el contenido que se lee del disco.
FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --from=build /app/public ./public
COPY --from=build /app/content ./content
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
