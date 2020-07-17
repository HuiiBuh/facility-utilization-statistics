FROM node:12-alpine

WORKDIR /usr/src/app

COPY src .

RUN npm install
RUN npm run build

# Install openssl
RUN apk add openssl

# Generate the keys
RUN mkdir /keys &&   openssl req -newkey rsa:2048 -nodes -keyout /keys/public.nest.pem -x509 -days 365 -out /keys/private.nest.pem \
-subj "/C=DE/ST=BW/L=Friedrichshaven/O=dhbw/OU=IT/CN=nodomain.nodomain"

CMD npm run start:prod