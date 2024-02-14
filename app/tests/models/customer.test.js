const Customer = require('../../models/customer');

test('Customer model creates instance with correct attributes', () => {
  const customer = Customer.build({ name: 'John Doe' });
  expect(customer.name).toBe('John Doe');
});
