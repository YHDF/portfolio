# Stage 1: Use a temporary image to pull the base image (only if not available)
FROM alpine:latest as base

# This stage does not include your application code, only used to pull the base image

# Stage 2: Build your application
FROM base as build

# Set up environment variables
ENV MAVEN_VERSION=3.8.8
ENV MAVEN_HOME=/usr/share/maven
ENV PATH=${MAVEN_HOME}/bin:${PATH}

ARG KEYSTORE_PASSWORD
ARG KEYMANAGER_PASSWORD
ARG CERT_ALIAS
ARG JETTY_BASE

ENV KEYSTORE_PASSWORD=${KEYSTORE_PASSWORD}
ENV KEYMANAGER_PASSWORD=${KEYMANAGER_PASSWORD}
ENV CERT_ALIAS=${CERT_ALIAS}
ENV JETTY_BASE=${JETTY_BASE}

RUN cat /etc/apk/repositories

# Install necessary dependencies using apk
RUN apk update && \
    apk add openjdk17 maven

# Set environment variables, if needed
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk

# Verify Maven installation
RUN mvn --version

# Cleanup and remove unnecessary files
RUN rm -rf /var/cache/apk/* && \
    rm -rf /root/.m2

# Stage 3: Build your application
FROM build as final

EXPOSE 9000

# Create parent directory
WORKDIR /portfolio

# Copy the parent pom.xml into the parent directory
COPY ../../../pom.xml  /portfolio/

# Create portfolio-webapp directory
WORKDIR /portfolio/portfolio-webapp

#Copying necessary code for portfolio-webapp
COPY ../../../portfolio-webapp/pom.xml  ../../../portfolio-webapp  /portfolio/portfolio-webapp/

#Remove default application preperties
RUN rm -f /portfolio/portfolio-webapp/src/main/resources/application.properties

#Copying the new application preperties(PROD)
COPY ../../../profiles/prod/application.properties /portfolio/portfolio-webapp/src/main/resources/

# Create portfolio-ws directory
WORKDIR /portfolio/portfolio-webservices

#Copying necessary code for portfolio-ws
COPY ../../../portfolio-webservices/pom.xml  ../../../portfolio-webservices /portfolio/portfolio-webservices/

# Create portfolio-core directory
WORKDIR /portfolio/portfolio-core

#Copying necessary code for portfolio-core
COPY ../../../portfolio-core/pom.xml  ../../../portfolio-core /portfolio/portfolio-core/

COPY ../../../profiles/prod /portfolio/portfolio-core/src/main/resources/

# Create portfolio-batch directory
WORKDIR /portfolio/portfolio-batch

#Copying necessary code for portfolio-core
COPY ../../../portfolio-batch/pom.xml  ../../../portfolio-batch  /portfolio/portfolio-batch/

# Create parent directory
WORKDIR /portfolio

# Install the necessary packages
RUN mvn clean install -Dproperty.environment.suffix=-prod

# Change the the directory of the portfolio-ws application
WORKDIR /portfolio/portfolio-webapp

# Run the portfolio-ws application
CMD ["sh", "-c", "mvn jetty:run -Dproperty.environment.suffix=-prod -Dkeystore.password=$KEYSTORE_PASSWORD -Dkeymanager.password=$KEYMANAGER_PASSWORD -Dcert.alias=$CERT_ALIAS -Djetty.base=$JETTY_BASE"]
