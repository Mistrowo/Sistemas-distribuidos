const amqp = require('amqplib/callback_api');

class RabbitMQProducer {
  constructor(queue) {
    this.queue = queue;
  }

  async send(message) {
    amqp.connect('amqp://localhost', (error0, connection) => {
      if (error0) throw error0;

      connection.createChannel((error1, channel) => {
        if (error1) throw error1;

        channel.assertQueue(this.queue, { durable: false });
        channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(message)));
      });
    });
  }
}

module.exports = RabbitMQProducer;