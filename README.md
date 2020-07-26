# Facility Statistics

This is a little NestJS server with a React frontend which extracts the capacity of the different facilities and generates a view good looking graphs from it. This helps you from going to the gym/climbing facility at less crowded times.  
The frontend is a installable PWA.

Facility preview:

![Screenshot 1](https://i.imgur.com/kWMyFt2.png)

Admin panel:

![Screenshot 2](https://i.imgur.com/KItKqCV.png)

## Add your own facilities

+ Go into the folder *server/src/config* folder.
+ Add you own facility in the *config.ts* file
+ Add your own extraction handler in the *extraction-handler* folder
+ Edit the *config.interfaces.ts* file, so the config file has the right type after you added your facility
+ Follow the instructions of this [README](docker/development/README.md)

## Deploy

+ See [here](docker/production/README.md)
+ Run the `build.sh file` which will build you the docker containers
+ Run `docker-compose up`
