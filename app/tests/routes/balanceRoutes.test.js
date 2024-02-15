const { deposit, withdraw } = require('../../controllers/transactionController');
const { validateDeposit, validateWithdrawal } = require('../../services/validationService');
const { producer } = require('../../services/kafkaService');
const Transaction = require('../../models/transaction');
const Account = require('../../models/account');

jest.mock('../../services/validationService');
jest.mock('../../services/kafkaService');

test('Deposit controller sends deposit request to Kafka producer', async () => {
  const mockReq = { body: { customer_id: 1, account_id: 1, amount: 50 } };
  const mockRes = { json: jest.fn() };

  validateDeposit.mockResolvedValueOnce({ isValid: true });

  await deposit(mockReq, mockRes);

  expect(producer.send).toHaveBeenCalledWith({
    topic: 'dtopoic',
    messages: [{ value: JSON.stringify(mockReq.body) }],
  });

  expect(mockRes.json).toHaveBeenCalledWith({ message: 'Deposit request received. Processing...' });
});

test('Withdraw controller sends withdrawal request to Kafka producer', async () => {
  const mockReq = { body: { customer_id: 1, account_id: 1, amount: 30 } };
  const mockRes = { json: jest.fn() };

  validateWithdrawal.mockResolvedValueOnce({ isValid: true });

  await withdraw(mockReq, mockRes);

  expect(producer.send).toHaveBeenCalledWith({
    topic: 'wtopoic',
    messages: [{ value: JSON.stringify(mockReq.body) }],
  });

  expect(mockRes.json).toHaveBeenCalledWith({ message: 'Withdrawal request received. Processing...' });
});
