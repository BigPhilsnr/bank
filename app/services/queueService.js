const Queue = require("bull");
const { recordTransaction} = require('../controllers/balanceController');
const Account = require("../models/account");

const queue = new Queue("bank_queue", {
  redis: { host: "redis", port: 6379 },
});

async function getQueueTotals(account_id) {
  const pendingJobs = await queue.getJobs(['waiting', 'active']);

  let pendingDeposits = 0;
  let pendingWithdrawals = 0;

  pendingJobs.forEach((job) => {
      const jobData = job.data;
      if (jobData && jobData.type === "deposit" && jobData.account_id === parseInt(account_id)) {
          pendingDeposits += jobData.amount || 0;
      } else if (jobData && jobData.type === "withdrawal" && jobData.account_id === parseInt(account_id)) {
          pendingWithdrawals += jobData.amount || 0;
      }
  });

  return (pendingDeposits - pendingWithdrawals );
}

async function startQueueWorker() {
  
  queue.process('process_transaction', async (job) => {
 
    try {
      console.log("MAKE THIS REDIS QUEUE WAORK")
      const { type, amount, customer_id, account_id } = job.data;
      console.log(JSON.stringify(job))
      if (type === "deposit") {
        console.log(job.data)
       
        await recordTransaction("deposit", amount, customer_id, account_id);
      } else if (type === "withdrawal") {
        console.log("WITHDRAWAS ENVENT TRANSCATIO")
        console.log(job.data)
        const account = await Account.findByPk(account_id);
        if (account) {
          console.log("Withdrawing the cash")
          await recordTransaction("withdrawal", amount, customer_id, account_id);
        }
      }else {
        console.log("UN SUPPORTED TRANSCATION")
      }
    } catch (error) {
      // Retry failed transactions up to 3 times
      if (job.attemptsMade < 3) {
        throw new Error("Retry");
      } else {
        console.error("Failed transaction after 3 attempts:", error.message);
        throw error;
      }
    }
  });

 const res=  await queue.isReady();
 console.log("REDIS QUEUE IS HAS STARTED")
}

async function handleWithdrawalEvent(message) {
  const data =JSON.parse(message.value.toString());
  await queue.add("process_transaction", {
    type: "withdrawal",
    amount: data.amount,
    customer_id: data.customer_id,
    account_id: data.account_id,
  });
}

async function handleDepositEvent(message) {
  const data =JSON.parse(message.value.toString());
  console.log("DATAT", data.toString())
  await queue.add("process_transaction", {
    type: "deposit",
    amount: data.amount,
    customer_id: data.customer_id,
    account_id: data.account_id,
  });
}


module.exports = {
  handleDepositEvent,
  handleWithdrawalEvent,
  startQueueWorker,
  queue, 
  getQueueTotals
};
