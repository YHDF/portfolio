FROM node:20-alpine as build

WORKDIR /usr/src/portfolio-client

# Copy package.json and package-lock.json to the container
COPY ../../../portfolio-client/package*.json ./

# Avoid copying unnecessary files in this step
COPY ../../../portfolio-client/src ./src/
COPY ../../../portfolio-client/angular.json .
COPY ../../../portfolio-client/tsconfig.app.json .
COPY ../../../portfolio-client/tsconfig.json .
COPY ../../../portfolio-client/tsconfig.spec.json .

RUN npm run clean
RUN npm install

# Copy other necessary files
COPY ../../../portfolio-client/localhost-key.pem .
COPY ../../../portfolio-client/localhost.pem .
COPY ../../../portfolio-client/README.md .
# Add more COPY commands as needed

RUN npm run build-prod

# Serve Application using Nginx Server

FROM nginx:latest as final

WORKDIR /usr/share/nginx/html

# Copy only the necessary files from the build stage
COPY --from=build /usr/src/portfolio-client/dist/portfolio-client .

COPY ../../../portfolio-client/localhost-key.pem /etc/nginx/localhost-key.pem
COPY ../../../portfolio-client/localhost.pem /etc/nginx/localhost.pem
COPY ./deployment/webapp/webclient/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 443
