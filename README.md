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


**## Bank Application - Schema Relationships**

In the bank application, there are three main schemas: `Customer`, `Account`, and `Transaction`. Let's explore how these schemas are related in a typical process flow.

## 1. Customer Schema:

The `Customer` schema represents the information related to a customer.

### Process Flow:

1. **Customer Creation:**
   - A new customer is created using the `createCustomerAndAccount` function.
   - This function creates a new record in the `Customer` table with a unique `id` and the customer's `name`.

## 2. Account Schema:

The `Account` schema represents the bank accounts associated with customers.

### Process Flow:

1. **Account Creation:**
   - When a new customer is created, an associated bank account is automatically created.
   - An `Account` record is created with a unique `id`, an initial `balance` of 0, a specified `currency`, and a reference to the customer through the `customer_id` field.
   - The `customer_id` field establishes a relationship with the `Customer` schema, indicating which customer owns the account.

## 3. Transaction Schema:

The `Transaction` schema represents the financial transactions that occur in the bank.

### Process Flow:

1. **Deposit or Withdrawal:**
   - When a deposit or withdrawal is initiated through the API, a message is sent to the Kafka broker.
   - The corresponding event handler (`handleDepositEvent` or `handleWithdrawalEvent`) processes the Kafka message.
   - The processed transaction details are added to a Redis queue for asynchronous processing.
   - The queue worker (`process_transaction` job) asynchronously records the transaction in the `Transaction` table.
   - The `Transaction` record includes details such as `type` (deposit or withdrawal), `amount`, `timestamp`, `customer_id`, and `account_id`.
   - The `customer_id` and `account_id` fields establish relationships with the `Customer` and `Account` schemas, indicating which customer and account the transaction is associated with.

### Relationships:

1. **Customer and Account:**
   - Each `Customer` can have multiple `Account`s.
   - The relationship is established by the `customer_id` field in the `Account` schema, linking back to the `id` field in the `Customer` schema.

2. **Account and Transaction:**
   - Each `Account` can have multiple `Transaction`s.
   - The relationship is established by the `account_id` field in the `Transaction` schema, linking back to the `id` field in the `Account` schema.

These relationships allow for tracking the ownership of accounts by customers and the transactions associated with each account.


