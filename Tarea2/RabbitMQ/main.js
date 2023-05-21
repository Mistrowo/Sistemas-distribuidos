const IoTDevice = require('./dataytime');
const RabbitMQProducer = require('./rabbitmq_producer');
const RabbitMQConsumer = require('./rabbitmq_consumer')

const n = 4; // Number of devices
const dt = 5000; // Time interval in milliseconds
const queue = 'iot_data';

const devices = [];
const rabbitMQProducer = new RabbitMQProducer(queue);
const rabbitMQConsumer = new RabbitMQConsumer(queue);

for (let i = 0; i < n; i++) {
  const device = new IoTDevice(i, dt);
  devices.push(device);
  device.start();
}

devices.forEach((device) => {
  device.on('data', (message) => {
    rabbitMQProducer.send(message);
  });
});

rabbitMQConsumer.receive();