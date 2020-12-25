#! /bin/sh
# Entrypoint for production docker container
mv /usr/share/nginx/html/index.html /tmp/index.html
envsubst < /tmp/index.html > /usr/share/nginx/html/index.html
envsubst < /app/container-state.json > /usr/share/nginx/html/container-state.json
nginx -g 'daemon off;'
