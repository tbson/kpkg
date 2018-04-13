server {
    listen 443;
    server_name my.domain;
    charset utf-8;
    root /resource/public/kpkg;
    index index.html;

    ssl on;
    # ssl_certificate /resource/ssl/kpkg/cer.crt;
    # ssl_certificate_key /resource/ssl/kpkg/rsa.key;

    ssl_certificate /resource/ssl/kpkg/fullchain.pem;
    ssl_certificate_key /resource/ssl/kpkg/privkey.pem;

    location /api/v1/ {
        proxy_pass https://kpkg_api:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /public {
        try_files $uri $uri/ /index.html;
        rewrite ^/public(/.*)$ $1 break;
        add_header Access-Control-Allow-Origin *;
    }
    location / {
        root /resource/public/kpkg/clients;
        try_files $uri $uri/ /index.html =404;
        add_header Access-Control-Allow-Origin *;
    }
    location /admin {
        root /resource/public/kpkg/clients;
        try_files $uri $uri/ /admin/index.html =404;
        add_header Access-Control-Allow-Origin *;
    }
    location /user {
        root /resource/public/kpkg/clients;
        try_files $uri $uri/ /user/index.html =404;
        add_header Access-Control-Allow-Origin *;
    }
}
