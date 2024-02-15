# Bank Application

This is a simple banking application built with Node.js, Express, Sequelize, Redis, Kafka, and Docker.

## Technologies Used

- Node.js
- Express
- Sequelize (MySQL)
- Redis
- Kafka
- Docker

## Prerequisites

Before running the application, ensure you have the following installed:
- Docker
- Ensure no application is running on default port 4500, or modify by adding PORT= <PORT_NUMBER>  in app/.env :

## Setup

1. **Start Docker containers:**

    ```
    docker-compose up 
    ```

    The application will be running on http://localhost:4500.
## Testing and Code Coverage

To run tests and generate code coverage, use the following command:

 ```
    docker-compose run test npm test
    ```


This will run both unit tests and API tests and generate a code coverage report.

## Design

- The application uses Sequelize as an ORM for MySQL database interactions.
- Kafka is utilized for handling events related to deposits and withdrawals.
- Redis is used for managing a queue of transactions.
- Unit tests are written using Jest and Supertest for API testing.
- Code coverage is measured and reported using Jest.

Feel free to explore the codebase for more details on the application's architecture and features.

