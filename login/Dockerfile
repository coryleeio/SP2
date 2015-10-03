FROM ubuntu:latest
RUN sudo apt-get update && apt-get install curl -y
RUN curl -sL https://deb.nodesource.com/setup | sudo bash -
RUN sudo apt-get install nodejs -y
ADD ./app /app
EXPOSE 80
RUN npm install -g browserify
RUN cd /app && npm install
RUN cd /app/app/ && browserify ./js/main.js > ./public/bundle.js
CMD ["node", "/app/server.js"]