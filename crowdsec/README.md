### Steps to install Crowdsec 
 >[!IMPORTANT]
   >
   >The traefik folder it is needed only if you have previously configured Traefik, the files inside is how should be these files configs. I recommend that you first install traefik on your environment, in my case it is in docker. 

1. Edit docker-compose.yml file as you convenience, usually this is what you need to configure:
    1. All the volumes section
    1. The environment section for the `CROWDSEC_BOUNCER_API_KEY` we will need to add it later...
1. In case that you have the traefik folder, change it later too. Add the middlewares for Crowdsec
1. Add the acquis.yml the path that you will have your logs detection.
1. When you run the docker containers you should have these two: `crowdsecurity/crowdsec:latest` and `fbonalair/traefik-crowdsec-bouncer:latest`
1. Execute the next command to get the `CROWDSEC_BOUNCER_API_KEY`
`sudo docker exec crowdsec cscli bouncers add bouncer-traefik`
1. Add this key into the docker-compose.yml `CROWDSEC_BOUNCER_API_KEY`
1. re-deploy the docker compose from crowdsec folder with this command `sudo docker compose up -d` all the containers should be up and running

Enjoy [Crowdsec](https://docs.crowdsec.net/docs/concepts)!!!


