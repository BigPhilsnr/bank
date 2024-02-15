FROM node:14

RUN pwd
WORKDIR /app

# Install wait-for-it script
ADD https://github.com/vishnubob/wait-for-it/raw/master/wait-for-it.sh /usr/local/bin/wait-for-it
RUN chmod +x /usr/local/bin/wait-for-it
COPY package*.json ./


RUN npm install -g nodemon
RUN npm install

COPY . .

# # Wait for MySQL and Kafka to be ready before starting the application
# CMD ["wait-for-it", "mysql:3306", "--", "wait-for-it", "kafka:9092", "--", "nodemon",]