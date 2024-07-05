### Steps to install Wireguard 
 >[!IMPORTANT]
   >
   >In my case I will use Headscale instead of wireguard, but I leave here this docker-compose in case that you want to use it, wireguard is super powerful and should be enough for homelabs

1. Edit docker-compose.yml file as you convenience, usually this is what you need to configure:
    1. WG_HOST, this is really important, because it will be used for external access, you should have a domain for that as we configured in Traefik or use Traefik itself
    1. All the optional area is for the Wireguard UI, in this case it will depend on you, I personally like more UI interfaces then I would enable all these area and configured. You should use your Network configuration on this area
    1. Modify the volumes areas as your convenience and that is it!
