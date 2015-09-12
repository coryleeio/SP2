FROM ubuntu:latest
RUN sudo apt-get update && apt-get install curl -y
RUN curl -sL https://deb.nodesource.com/setup | sudo bash -
RUN sudo apt-get install nodejs -y
ADD ./app /app
EXPOSE 3000
RUN cd /app && npm install
CMD ["node", "/app/app.js"]