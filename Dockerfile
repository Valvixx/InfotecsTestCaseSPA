# === Сборка SPA ===
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# === Nginx для отдачи SPA ===
FROM nginx:alpine

# Важно: удалить дефолтный контент nginx, чтобы не оставался Welcome page
RUN rm -rf /usr/share/nginx/html/*

# Копируем именно browser (клиентскую сборку)
COPY --from=build /app/dist/untitled1/browser/ /usr/share/nginx/html/

# Конфиг nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
