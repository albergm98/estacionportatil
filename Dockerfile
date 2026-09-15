FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html
# No servir originales ni herramientas en producción
RUN rm -rf /usr/share/nginx/html/assets/img/foto/original \
           /usr/share/nginx/html/herramientas \
           /usr/share/nginx/html/.git \
           /usr/share/nginx/html/.cursor \
           /usr/share/nginx/html/docs \
           /usr/share/nginx/html/Dockerfile \
           /usr/share/nginx/html/nginx.conf \
           /usr/share/nginx/html/.gitignore
EXPOSE 80
