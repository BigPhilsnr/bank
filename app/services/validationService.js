const Account = require("../models/account");
const Transaction = require("../models/transaction");
const { startOfDay, endOfDay } = require("date-fns");
const { Op,literal} = require("sequelize");
async function validateDeposit(amount, customer_id, account_id) {
  if (customer_id === null || account_id === null) {
    return {
      isValid: false,
      errorMessage:
        "Both customer and account parameters are required for deposit",
    };
  }

  if (amount > 40000) {
    return {
      isValid: false,
      errorMessage: "Max per transaction for deposit is Kes. 40K",
    };
  }

  const depositCountForTheDay = await Transaction.count({
    where: {
        type: "deposit",
        customer_id: customer_id,
        account_id: account_id,
        timestamp: { 
          [Op.gte]: literal('CURRENT_DATE'), // Sequelize literal for the current date
          [Op.lt]: literal('CURRENT_DATE + INTERVAL 1 DAY'),
        },
    },
});
console.log("deposit count", depositCountForTheDay)

if (depositCountForTheDay >= 4) {
    return { isValid: false, errorMessage: "Max frequency reached for deposit (4 transactions/day)" };
}

const totalDepositForTheDay = await Transaction.sum("amount", {
    where: {
        type: "deposit",
        customer_id: customer_id,
        account_id: account_id,
        timestamp: {  [Op.gte]: literal('CURRENT_DATE'), // Sequelize literal for the current date
        [Op.lt]: literal('CURRENT_DATE + INTERVAL 1 DAY'), },
    },
}) || 1;
console.log("totalDeposit for the day", totalDepositForTheDay)

if (totalDepositForTheDay + amount > 150000) {
    return { isValid: false, errorMessage: "Max limit for the day reached for deposit (Kes. 150K)" };
}



  if (amount === null || amount <= 0) {
    return { isValid: false, errorMessage: "Invalid deposit amount" };
  }
  const account = await Account.findOne({
    where: { id: account_id, customer_id: customer_id },
  });
  if (!account) {
    return {
      isValid: false,
      errorMessage: "Account not found for the given customer and account",
    };
  }

  return { isValid: true, errorMessage: null };
}

async function validateWithdrawal(
  amount,
  customer_id,
  account_id,
  current_balance
) {
  if (customer_id === null || account_id === null) {
    return {
      isValid: false,
      errorMessage:
        "Both customer and account parameters are required for withdrawal",
    };
  }

  if (amount === null || amount <= 0) {
    return { isValid: false, errorMessage: "Invalid withdrawal amount" };
  }

  if (amount > current_balance) {
    return { isValid: false, errorMessage: "Insufficient funds" };
  }

  const account = await Account.findOne({
    where: { id: account_id, customer_id: customer_id },
  });

  if (amount > 20000) {
    return { isValid: false, errorMessage: "Max per transaction for withdrawal is Kes. 20K" };
}

const withdrawalCountForTheDay = await Transaction.count({
    where: {
        type: "withdrawal",
        customer_id: customer_id,
        account_id: account_id,
        timestamp: {  [Op.gte]: literal('CURRENT_DATE'), // Sequelize literal for the current date
          [Op.lt]: literal('CURRENT_DATE + INTERVAL 1 DAY'), },
    },
});

if (withdrawalCountForTheDay >= 3) {
    return { isValid: false, errorMessage: "Max frequency reached for withdrawal (3 transactions/day)" };
}

const totalWithdrawalForTheDay = await Transaction.sum("amount", {
    where: {
        type: "withdrawal",
        customer_id: customer_id,
        account_id: account_id,
        timestamp: {  [Op.gte]: literal('CURRENT_DATE'), // Sequelize literal for the current date
          [Op.lt]: literal('CURRENT_DATE + INTERVAL 1 DAY'), },
    },
}) || 0;

if (totalWithdrawalForTheDay + amount > 50000) {
    return { isValid: false, errorMessage: "Max limit for the day reached for withdrawal (Kes. 50K)" };
}

  if (!account) {
    return {
      isValid: false,
      errorMessage: "Account not found for the given customer and account",
    };
  }

  return { isValid: true, errorMessage: null };
}

module.exports = {
  validateDeposit,
  validateWithdrawal,
};
