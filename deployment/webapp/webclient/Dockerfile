FROM node:20-alpine as build

RUN mkdir -p /usr/src/portfolio-client

WORKDIR /usr/src/portfolio-client

# Copy package.json and package-lock.json to the container
COPY ../../../portfolio-client/package*.json ./

RUN npm run clean

RUN npm install

# Copy the rest of the code to the container
COPY ../../../portfolio-client/. .

COPY ../../../profiles/localhost-key.pem ../../../profiles/localhost.pem ./

RUN npm run build-prod

# Serve Application using Nginx Server

FROM nginx:latest as final

COPY --from=build /usr/src/portfolio-client/dist/portfolio-client /usr/share/nginx/html

COPY ../../../profiles/localhost.pem ../../../profiles/localhost-key.pem /etc/nginx/

# Overwrite the default nginx.conf with the one from the step 1
COPY ./deployment/webapp/webclient/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 443