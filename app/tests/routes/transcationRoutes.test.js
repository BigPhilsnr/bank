const request = require('supertest');
const express = require('express');
const transactionRoutes = require('../../routes/transactionRoutes');
const { deposit, withdraw } = require('../../controllers/transactionController');

jest.mock('../../controllers/transactionController');

const app = express();
app.use('/transaction', transactionRoutes);

test('POST /transaction/deposit sends deposit request successfully', async () => {
  const mockResponse = { message: 'Deposit request received. Processing...' };

  deposit.mockImplementation(async (req, res) => {
    res.json(mockResponse);
  });

  const response = await request(app)
    .post('/transaction/deposit')
    .send({ customer_id: 1, account_id: 1, amount: 50 });

  expect(response.status).toBe(200);
  expect(response.body).toEqual(mockResponse);
});

test('POST /transaction/withdraw sends withdrawal request successfully', async () => {
  const mockResponse = { message: 'Withdrawal request received. Processing...' };

  withdraw.mockImplementation(async (req, res) => {
    res.json(mockResponse);
  });

  const response = await request(app)
    .post('/transaction/withdraw')
    .send({ customer_id: 1, account_id: 1, amount: 30 });

  expect(response.status).toBe(200);
  expect(response.body).toEqual(mockResponse);
});
