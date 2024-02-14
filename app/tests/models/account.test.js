const Account = require('../../models/account');

test('Account model creates instance with correct attributes', () => {
  const account = Account.build({
    balance: 100,
    currency: 'USD',
    customer_id: 1,
  });
  expect(account.balance).toBe(100);
  expect(account.currency).toBe('USD');
  expect(account.customer_id).toBe(1);
});
