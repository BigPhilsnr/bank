const { sequelize } = require('../../services/databaseService');

test('Database service connects to the correct database', async () => {
  const databaseName = sequelize.config.database;
  expect(databaseName).toBe('bank_db');
});

