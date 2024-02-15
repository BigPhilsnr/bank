const { validateDeposit, validateWithdrawal } = require("../services/validationService");
const { producer, kafka } = require("../services/kafkaService");
const Account = require("../models/account");


async function deposit(req, res) {
  console.log(req.body)
  const { amount } = req.body;

  const { isValid, errorMessage } = await validateDeposit(
    amount,
    req.body.customer_id,
    req.body.account_id
  );

  if (!isValid) {
    return res.status(400).json({ error: errorMessage });
  }
  

  await producer.send({
    topic: "dtopoic",
    messages: [
      {
        value: JSON.stringify({
          customer_id: req.body.customer_id,
          account_id: req.body.account_id,
          amount,
        }),
      },
    ],
  });

  res.json({ message: "Deposit request received. Processing..." });
  
}

async function withdraw(req, res) {
  const { amount } = req.body;
  const account_id = req.body.account_id;

  if (!account_id) {
    return res
      .status(400)
      .json({ error: "Account parameter is required for withdrawal" });
  }

  const account = await Account.findByPk(account_id);

  if (!account) {
    return res
      .status(404)
      .json({ error: `Account not found for the given account` });
  }

  const { isValid, errorMessage } = await validateWithdrawal(
    amount,
    req.body.customer_id,
    account_id,
    account.balance
  );

  if (!isValid) {
    return res.status(400).json({ error: errorMessage });
  }

  await producer.send({
    topic: "wtopoic",
    messages: [
      {
        value: JSON.stringify({
          customer_id: req.body.customer_id,
          account_id,
          amount,
        }),
      },
    ],
  });

  res.json({ message: "Withdrawal request received. Processing..." });
}

module.exports = {
  deposit,
  withdraw,
};
