FROM node:8.9

# Use NPMSCRIPT=builddev for local dockers
ARG NPMSCRIPT=build

MAINTAINER datapunt@amsterdam.nl

EXPOSE 80

RUN apt-get update && apt-get install -y git nginx

COPY package.json /app/

WORKDIR /app

ENV PATH=./node_modules/.bin/:~/node_modules/.bin/:$PATH
RUN git config --global url."https://".insteadOf git:// && \
    git config --global url."https://github.com/".insteadOf git@github.com: && \
    npm --production=false --unsafe-perm install && \
    chmod -R u+x node_modules/.bin/

COPY . /app

RUN npm run $NPMSCRIPT && cp -r /app/dist/. /var/www/html/

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
 && ln -sf /dev/stderr /var/log/nginx/error.log

COPY default.conf /etc/nginx/conf.d/
CMD ["nginx", "-g", "daemon off;"]
