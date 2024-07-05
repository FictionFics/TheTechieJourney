### Steps to install Restic 

#### What is Restic?
It is simply as a backup tool that we will use for backing up our containers :) 
https://restic.net/

1. Edit docker-compose.yml file as you convenience, usually this is what you need to configure:
    1. RESTIC_PASSWORD, remeber always use one secure one
    1. Volumes area, one for restic files and other for the restore backups
    1. The TZ accordingly to yours. 
