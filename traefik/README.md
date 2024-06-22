### Steps to install Traefik 

1. Edit docker-compose.yml file as you convenience, usually this is what you need to configure:
    1. All the volumes section
    1. The environment area
    1. The next lines from your own domain
        1. "traefik.http.routers.traefik.rule=Host(`traefik-dashboard.yourdomain.co.uk`)"
        1. "traefik.http.routers.traefik-secure.rule=Host(`traefik-dashboard.yourdomain.co.uk`)"
        1. "traefik.http.routers.traefik-secure.tls.domains[0].main=yourdomain.co.uk"
        1. "traefik.http.routers.traefik-secure.tls.domains[0].sans=*.yourdomain.co.uk"
1. You will need to change the permissions for the acme.json inside traefik-config folder
    `sudo chmod 600 acme.json`
1. In traefik.yml inside traefik-config you will need to change the acme area with your email for CLoudFlare
