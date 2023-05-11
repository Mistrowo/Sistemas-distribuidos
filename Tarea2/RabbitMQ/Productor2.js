const amqp = require('amqplib');
const uuid = require('uuid');

const RABBITMQ_URL = 'amqp://localhost';
const QUEUE_NAME = 'iot_devices_queue';

async function connectToRabbitMQ() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: false });
  return channel;
}

function sendDeviceData(channel, deviceId, data) {
  const message = {
    deviceId,
    timestamp: Date.now(),
    value: data,
  };
  channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)));
}

async function startSendingData(deviceId, deltaT, dataSize) {
  const channel = await connectToRabbitMQ();
  setInterval(() => {
    const data = {
      data: uuid.v4().repeat(dataSize),
    };
    sendDeviceData(channel, deviceId, data);
  }, deltaT * 1000);
}

startSendingData(0, 5, 10); // se envian  datos desde el dispositivo 0 cada 5 segundos con un tamaño de 10
