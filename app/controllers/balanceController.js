const Account = require("../models/account");
const Transaction = require("../models/transaction");


async function getBalance(req, res) {
  const account_id = req.query.account_id;
  if (!account_id) {
    return res
      .status(400)
      .json({ error: "Account parameter is required for balance" });
  }

  const committedDeposits =
    (await Transaction.sum("amount", {
      where: { account_id: account_id, type: "deposit" },
    })) || 0;
  const committedWithdrawals =
    (await Transaction.sum("amount", {
      where: { account_id: account_id, type: "withdrawal" },
    })) || 0;

  const totalDeposits = committedDeposits;
  const totalWithdrawals = committedWithdrawals;

  const account = await Account.findByPk(account_id);
  const accountBalance = totalDeposits - totalWithdrawals;
  const { getQueueTotals } = require("../services/queueService");
  const pendingTotals = await getQueueTotals(account_id)
  console.log("UPDATED PENDING JOBS", pendingTotals)
  const balance = accountBalance + pendingTotals;
  

  res.json({ balance, currency: account.currency });

}

async function recordTransaction(type, amount, customer_id, account_id) {
  console.log("Transaction Running");
  const timestamp = new Date().toISOString();

  try {
    // Create a transaction record
    await Transaction.create({ type, amount, timestamp, customer_id, account_id });
    console.log("Transaction created successfully");

    // Get total deposits and total withdrawals for the account
    const [totalDeposits, totalWithdrawals] = await Promise.all([
      Transaction.sum("amount", {
        where: { account_id: account_id, type: "deposit" },
      }),
      Transaction.sum("amount", {
        where: { account_id: account_id, type: "withdrawal" },
      }),
    ]);

    // Calculate balance
    const balance = (totalDeposits || 0) - (totalWithdrawals || 0);

    // Update the account balance
    const account = await Account.findByPk(account_id);

    if (account) {
      await account.update({ balance });
      console.log("Account balance updated successfully");
    } else {
      console.error("Account not found for the given account_id:", account_id);
    }
  } catch (error) {
    console.error("Error creating/updating transaction:", error.message);
    throw error;
  }
}


module.exports = {
  recordTransaction, 
  getBalance,
};
