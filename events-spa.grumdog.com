server {
    listen 80;
    listen [::]:80;

    server_name events-spa.grumdog.com;

    location /api/v1/ {
        proxy_pass http://localhost:4787;
    }

    location / {
        root /home/eventsspa/events-spa/web-ui/build;
        index index.html;
        try_files $uri /index.html;	 
    }
}
