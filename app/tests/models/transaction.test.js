const Transaction = require('../../models/transaction');

test('Transaction model creates instance with correct attributes', () => {
  const transaction = Transaction.build({
    type: 'deposit',
    amount: 50,
    timestamp: '2022-02-14T12:00:00Z',
    customer_id: 1,
    account_id: 1,
  });
  expect(transaction.type).toBe('deposit');
  expect(transaction.amount).toBe(50);
  expect(transaction.timestamp).toBe('2022-02-14T12:00:00Z');
  expect(transaction.customer_id).toBe(1);
  expect(transaction.account_id).toBe(1);
});
