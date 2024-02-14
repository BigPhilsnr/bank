const Customer = require("../models/customer");
const Account = require("../models/account");
const { sequelize } = require("../services/databaseService")

async function seedCustomerAndAccount(req, res) {
  createCustomerAndAccount("John Doe", "USD")
  .then(({ customerId, accountId }) => {
    return res.status(200).json({ customerId, accountId });

  })
  .catch((error) => {
    console.log(error)
     return res.status(400).json({ error });
  });
}

async function createCustomerAndAccount(customerName, accountCurrency) {
  try {
    const result = await sequelize.transaction(async (transaction) => {
      // Create a customer
      const customer = await Customer.create(
        { name: customerName },
        { transaction }
      );

      // Create an account associated with the customer
      const account = await Account.create(
        { balance: 0, currency: accountCurrency, customer_id: customer.id },
        { transaction }
      );

      // Return customer id and account id
      return { customerId: customer.id, accountId: account.id };
    });

    return result;
  } catch (error) {
    console.error("Error creating customer and account:", error);
    throw error;
  }
}



module.exports = {
  seedCustomerAndAccount,
};
