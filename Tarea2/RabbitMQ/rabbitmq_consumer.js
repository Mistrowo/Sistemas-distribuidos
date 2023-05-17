const amqp = require('amqplib/callback_api');

class RabbitMQConsumer {
  constructor(queue) {
    this.queue = queue;
  }

  receive() {
    amqp.connect('amqp://localhost', (error0, connection) => {
      if (error0) throw error0;

      connection.createChannel((error1, channel) => {
        if (error1) throw error1;

        channel.assertQueue(this.queue, { durable: false });

        channel.consume(
          this.queue,
          (msg) => {
            console.log('RabbitMQ Consumer received:', msg.content.toString());
          },
          { noAck: true }
        );
      });
    });
  }
}

module.exports = RabbitMQConsumer;
