# Deploy to production

To build the different docker containers run the `build.sh` file.  
Every nginx docker container uses self signed certificates, so the connection can be secured.

Use your own reverse proxy with a valid cert as reverse in front of the reverse proxy of the application
