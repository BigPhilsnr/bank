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



  if (!producer.isConnected()) {
    producer.connect()
  } else {
    console.log("Producer is connected")
  }

  const messagePayload = JSON.stringify({
    customer_id: req.body.customer_id,
    account_id: req.body.account_id,
    amount,
  });



  // Produce a message to the 'deposit_topic' topic
  producer.produce('deposit_topic', null, Buffer.from(messagePayload), null, Date.now());
  if (!producer.isConnected()) {
    producer.connect()
  } else {
    console.log("Producer is connected")
  }


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



  // Produce a message to the 'withdrawal_topic' topic

  if (!producer.isConnected()) {
    producer.connect()
  }
  const messagePayload = JSON.stringify({
    customer_id: req.body.customer_id,
    account_id: req.body.account_id,
    amount,
  });

  // Produce a message to the 'withdrawal_topic' topic
  producer.produce('withdrawal_topic', null, Buffer.from(messagePayload), null, Date.now());
 
 // Event handler for the ready event
 
  // Event handler for the event.error event
  producer.on('event.error', (err) => {
    console.error('Error from producer:', err);
  });


  res.json({ message: "Withdrawal request received. Processing..." });
}

module.exports = {
  deposit,
  withdraw,
};
