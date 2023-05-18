const IoTDevice = require('./dataytime');
const KafkaProducer = require('./kafka_producer');
const KafkaConsumer = require('./kafka_consumer');

const n = 3; // Number of devices
const dt = 5000; // Time interval in milliseconds
const topic = 'iot_data';

const devices = [];
const kafkaProducer = new KafkaProducer(topic);
const kafkaConsumer = new KafkaConsumer(topic);

for (let i = 0; i < n; i++) {
  const device = new IoTDevice(i, dt);
  devices.push(device);
  device.start();
}

devices.forEach((device) => {
  device.on('data', (message) => {
    kafkaProducer.send(message);
  });
});

kafkaConsumer.receive();