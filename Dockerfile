# syntax=docker/dockerfile:1

# Usar imagen base ligera de Node.js 20 Alpine para reducir el tamaño final
FROM node:20-alpine AS base

# Establecer directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar solo el package.json primero para aprovechar la caché de Docker
# Si las dependencias no cambian, no se reinstalarán
COPY app/package.json ./

# Instalar solo dependencias de producción (sin devDependencies) para imagen más pequeña
# Limpiar caché de npm para reducir tamaño
RUN npm install --omit=dev && npm cache clean --force

# Copiar el código fuente de la aplicación
COPY app/src ./src

# Copiar archivos estáticos (HTML, CSS) para servir desde Express
COPY app/public ./public

# Exponer el puerto 3000 donde correrá la aplicación
EXPOSE 3000

# Establecer variable de entorno para modo producción
ENV NODE_ENV=production

# Comando por defecto para iniciar la aplicación
CMD ["node", "src/index.js"]


