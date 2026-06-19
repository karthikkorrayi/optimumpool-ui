FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --silent

COPY . .
RUN npm run build -- --configuration production

FROM nginx:alpine AS runtime

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist/optimumpool-ui/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]