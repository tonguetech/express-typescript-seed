FROM node:11.6.0

# environment
ARG GIT_TAG
ENV GIT_TAG=${GIT_TAG}

# create the app directory
RUN mkdir -p /app
WORKDIR /app
COPY dist /app/dist
COPY static /app/dist/static
COPY package.json /app
COPY app.config.yml /app
RUN yarn --production=true --force

# expose the port
EXPOSE 8080

# start the container
CMD [ "bash", "-c", "yarn start" ]