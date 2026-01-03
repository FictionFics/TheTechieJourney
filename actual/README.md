# Actual Budget - Docker Compose Setup

Simple docker-compose configuration for Actual Budget with Traefik reverse proxy.

## Steps to Install

1. **Edit docker-compose.yml** file as needed:
   1. Update the volume path to your preference:
      - `"/home/fics/docker/actual/data:/data"`
   2. Set your timezone in the environment section (currently `Europe/Madrid`)
   3. Replace `actual.yourdomain.com` with your actual domain in these lines:
      - `"traefik.http.routers.actual.rule=Host(\`actual.yourdomain.com\`)"`
      - `"traefik.http.routers.actual-secure.rule=Host(\`actual.yourdomain.com\`)"`

2. **If you don't have it, ensure the proxy network exists:**
   ```bash
   docker network create proxy
   ```

3. **Start the container:**
   ```bash
   docker-compose up -d
   ```

4. Access Actual Budget at `https://actual.yourdomain.com`

## Notes
- Default internal port is 5006
- Data is persisted in the mounted volume
- Traefik handles SSL/TLS certificates and HTTP to HTTPS redirect