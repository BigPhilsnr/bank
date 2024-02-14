const { producer, consumer, subscribeToTopics } = require('../../services/kafkaService');


test('Kafka service initializes producer and consumer', async () => {
  await expect(producer.connect()).resolves.toBeUndefined();
  await expect(consumer.connect()).resolves.toBeUndefined();
});

test('Kafka service subscribes to topics', async () => {
  // You might need to mock the subscribe function for testing purposes
  // Mocking is necessary as you don't want to perform actual Kafka operations in unit tests
  const mockSubscribe = jest.fn();
  consumer.subscribe = mockSubscribe;

  await subscribeToTopics();

  expect(mockSubscribe).toHaveBeenCalledTimes(2); // Adjust based on your actual number of topics
});
