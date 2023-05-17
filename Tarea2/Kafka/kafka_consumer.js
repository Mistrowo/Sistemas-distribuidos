const kafka = require('kafka-node');
const { KafkaClient, Consumer } = kafka;

class KafkaConsumer {
  constructor(topic) {
    this.topic = topic;
    this.client = new KafkaClient({ kafkaHost: 'localhost:9092' });
    this.consumer = new Consumer(this.client, [{ topic: this.topic }], { autoCommit: true });
  }

  async receive() {
    this.consumer.on('message', (message) => {
      console.log('Kafka Consumer received:', message.value);
    });

    this.consumer.on('error', (err) => {
      console.error(err);
    });
  }
}

module.exports = KafkaConsumer;