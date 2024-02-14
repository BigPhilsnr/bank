const { Kafka } = require("kafkajs");
const { handleDepositEvent, handleWithdrawalEvent } = require("./queueService");
const kafka = new Kafka({ brokers: ["localhost:9092", "kafka:9092"],
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
  await consumer.subscribe({ topic: "deposit_topic" });
  await consumer.subscribe({ topic: "withdrawal_topic" });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (topic == "deposit_topic") {
        await handleDepositEvent(message);
      } else if (topic == "withdrawal_topic") {
        await handleWithdrawalEvent(message);
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
