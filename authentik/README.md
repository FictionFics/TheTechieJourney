### Steps to install Authentik 
 >[!IMPORTANT]
   >
   > The docker compose that I will provide is with the traefik that we already have configured, take a look if you want in my repo.

The docker compose will install:
- Postgress Database
- Redis
- Authentik worker (Distribute the work from the server to perform some actions.) 
- Authentik server

In this case we should modify two things here, the `.env` file and the `docker-compose.yml`
1. Edit docker-compose.yml file as you convenience, usually this is what you need to configure:
    - labels, you should change your domain `authentik.yourdomain.com`
    - volumes, you could use binds or volumes, in my case I will use volumes

2. Edit the `.env` this fle is a useful file for all the credentials that we will need for authentik compose, as we will need to repeat some of them is better practice create a env file and you use it as external resource in the compose, things to modify:
    - `PG_PASS`
    - `AUTHENTIK_SECRET_KEY`
    - `AUTHENTIK_EMAIL__USERNAME`
    - `AUTHENTIK_EMAIL__PASSWORD`
    - `AUTHENTIK_EMAIL__FROM` (Optional, only in case that you want to use SMTP gmail for sending emails of alerts) 