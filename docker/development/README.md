# Development docker file

## Setup

This docker file has the purpose of letting you develop the backend, and the frontend similar to the real production environment.

+ Start the frontend
+ Start the backend

This docker container redirects these two services to

+ [http://localhost](http://localhost) for the frontend
+ [http://localhost/api](http://localhost) for the backend

You can then visit [http://localhost](http://localhost) and see the react app and the api interacting with each other.

## Run container

Start your services and run the nginx docker container.

```bash
docker-compose build --no-cache
docker-compose up
```
