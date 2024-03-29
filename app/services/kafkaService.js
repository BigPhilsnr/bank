const { Kafka } = require("kafkajs");
const { handleDepositEvent, handleWithdrawalEvent } = require("./queueService");
const kafka = new Kafka({ brokers: ["kafka:9093",],
retry: {
  initialRetryTime: 100,    // initial retry time in milliseconds
  maxRetryTime: 30000,      // maximum retry time in milliseconds
  retries: 10,              // maximum number of retries before giving up
  factor: 1.2,              // exponential backoff factor
},
});
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "bank" });

async function subscribeToTopics() {
  await producer.connect();
  await consumer.connect()
  await consumer.subscribe({ topic: "dtopoic", fromBeginning: true  });
  await consumer.subscribe({ topic: "wtopoic",  fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (topic == "dtopoic") {
        await handleDepositEvent(message);
      } else if (topic == "wtopoic") {
        await handleWithdrawalEvent(message);
      } else {
        console.log(message)
      }
    },
  });
  

}

module.exports = {
  producer,
  consumer,
  kafka,
  subscribeToTopics,
};
