FROM node:12-alpine

WORKDIR /usr/src/app

COPY src .
RUN mkdir db

RUN npm install
RUN npm run build

# Install openssl
RUN apk add openssl

# Generate the keys
RUN mkdir /keys && openssl req -newkey rsa:2048 -nodes -keyout /keys/nestjs.key -x509 -days 365 -out /keys/nestjs.cert \
    -subj "/C=DE/ST=BW/L=Friedrichshaven/O=dhbw/OU=IT/CN=nodomain.nodomain"

CMD npm run start:prod