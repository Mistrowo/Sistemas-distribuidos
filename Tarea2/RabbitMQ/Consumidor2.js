const amqp = require('amqplib');

const RABBITMQ_URL = 'amqp://localhost';
const QUEUE_NAME = 'iot_devices_queue';

async function connectToRabbitMQ() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: false });
  return channel;
}

async function startReceivingData() {
  const channel = await connectToRabbitMQ();
  console.log(`[*] Esperando mensajes en la cola ${QUEUE_NAME}. Presiona CTRL+C para salir.`);

  channel.consume(QUEUE_NAME, (message) => {
    const deviceData = JSON.parse(message.content.toString());
    console.log(`Device ${deviceData.deviceId} sending: ${JSON.stringify(deviceData.value)}`);
  }, { noAck: true });
}

startReceivingData();
