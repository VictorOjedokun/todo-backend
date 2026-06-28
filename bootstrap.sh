#!/bin/bash
# Run once on the frontend VM before the first GitHub Actions deploy
set -euo pipefail

echo "==> Installing Nginx..."
apt-get update -y
apt-get install -y nginx

echo "==> Creating web root..."
mkdir -p /var/www/todo-frontend

echo "==> Configuring Nginx..."
cat > /etc/nginx/sites-available/todo-frontend <<'EOF'
server {
    listen 80;
    server_name _;

    root /var/www/todo-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/javascript application/json;
}
EOF

ln -sf /etc/nginx/sites-available/todo-frontend /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx && systemctl enable nginx

echo "✅ Frontend VM ready. Push to main to deploy."