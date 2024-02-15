const Kafka = require('node-rdkafka');
const { handleDepositEvent, handleWithdrawalEvent } = require('./queueService');

const kafkaConf = {
  'metadata.broker.list': 'localhost:9092',
  'retry.backoff.ms': 100,
  'message.send.max.retries': 10,
  'socket.keepalive.enable': true,
  'enable.auto.commit': false,
  'group.id': 'bank',
};

const producer = new Kafka.Producer({
  'metadata.broker.list': kafkaConf['metadata.broker.list'],
});

const consumer = new Kafka.KafkaConsumer({
  'metadata.broker.list': kafkaConf['metadata.broker.list'],
  'group.id': kafkaConf['group.id'],
});

async function subscribeToTopics() {
  producer.connect();
  consumer.connect();
  consumer.on('ready', () => {
    consumer.subscribe(['deposit_topic', 'withdrawal_topic']);

    consumer.consume();
    consumer.on('data', (message) => {
      const topic = message.topic.toString();

      if (topic === 'deposit_topic') {
        handleDepositEvent(message.value.toString());
      } else if (topic === 'withdrawal_topic') {
        handleWithdrawalEvent(message.value.toString());
      }
    });
  });
  producer.on('ready', () => {
    console.log('CONNECTION IS READY')
  
  });

  producer.on('event.error', (err) => {
    console.error('Error from producer:', err);
  });

  consumer.on('event.error', (err) => {
    console.error('Error from consumer:', err);
  });
}

module.exports = {
  producer,
  consumer,
  subscribeToTopics,
};
