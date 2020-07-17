FROM node:12-alpine as builder

WORKDIR /usr/src/app
COPY src .

RUN npm install
RUN npm run build

# Serve the built files
FROM nginx:stable-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/build .

# Remove the default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy the nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Install openssl
RUN apk add openssl

# Generate the keys
RUN mkdir /keys && openssl req -newkey rsa:2048 -nodes -keyout /keys/nginx.key -x509 -days 365 -out /keys/nginx.crt \
-subj "/C=DE/ST=BW/L=Friedrichshaven/O=dhbw/OU=IT/CN=nodomain.nodomain"