const kafka = require('kafka-node');
const util = require('util');

const client = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' });
const consumer = new kafka.Consumer(client, [{ topic: 'iot_data' }]);

consumer.on('message', (message) => {
  console.log('Kafka Consumer received:', message.value);
});

consumer.on('error', (err) => {
  console.error('Error with Kafka consumer:', err);
});
