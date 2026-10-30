FROM nginx:alpine

# Copiamos todo el contenido del frontend (incluyendo index.html) al directorio HTML de Nginx
COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]