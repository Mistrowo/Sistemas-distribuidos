const kafka = require('kafka-node');
const { KafkaClient, Producer } = kafka;

class KafkaProducer {
  constructor(topic) {
    this.topic = topic;
    this.client = new KafkaClient({ kafkaHost: 'localhost:9092' });
    this.producer = new Producer(this.client);
  }

  async send(message) {
    const payloads = [{ topic: this.topic, messages: JSON.stringify(message) }];

    this.producer.on('ready', () => {
      this.producer.send(payloads, (err, data) => {
        if (err) console.error(err);
      });
    });

    this.producer.on('error', (err) => {
      console.error(err);
    });
  }
}

module.exports = KafkaProducer;


//kafka-topics.sh --create --bootstrap-server localhost:9092 --topic iot_data --partitions 1 --replication-factor 1
