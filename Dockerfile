FROM nginx:1.16.1
COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /dist
COPY ./dist /dist