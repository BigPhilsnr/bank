const supertest = require('supertest');
const app = require('../path-to-your-app'); // Update the path
const { sequelize } = require('../path-to-your-file'); // Update the path

before(async () => {
  // Ensure the database is synced before running tests
  await sequelize.sync();
});

describe('API Tests', () => {
  it('should get account balance', async () => {
    const response = await supertest(app).get('/balance?account_id=1');

    // Assert the response status and structure
    assert.equal(response.status, 200);
    assert.property(response.body, 'balance');
    assert.property(response.body, 'currency');
  });

  it('should seed data and return customer and account IDs', async () => {
    const response = await supertest(app).get('/seed');

    // Assert the response status and structure
    assert.equal(response.status, 200);
    assert.property(response.body, 'customerId');
    assert.property(response.body, 'accountId');
  });

  it('should handle deposit request', async () => {
    const response = await supertest(app)
      .post('/deposit')
      .send({
        amount: 100,
        customer_id: 1,
        account_id: 1,
      });

    // Assert the response status and structure
    assert.equal(response.status, 200);
    assert.property(response.body, 'message');
  });

  // Add more API tests for other endpoints
});
