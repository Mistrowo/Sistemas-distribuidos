const amqp = require('amqplib');

const RABBITMQ_URL = 'amqp://localhost';

// Nombres de las colas para recibir información de los 5 productores
const QUEUE_NAMES = [
  'iot_devices_queue_1',
  'iot_devices_queue_2',
  'iot_devices_queue_3',
  'iot_devices_queue_4',
  'iot_devices_queue_5',
];

async function connectToRabbitMQ(queueName) {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: false });
  return channel;
}

async function startReceivingData() {
  const channels = [];
  const numQueues = QUEUE_NAMES.length;

  // Conectarse a cada una de las colas
  for (let i = 0; i < numQueues; i++) {
    const channel = await connectToRabbitMQ(QUEUE_NAMES[i]);
    channels.push(channel);
  }

  console.log(`[*] Esperando mensajes en las colas ${QUEUE_NAMES.join(', ')}. Presiona CTRL+C para salir.`);

  // Procesar mensajes de cada cola
  channels.forEach((channel, i) => {
    channel.consume(QUEUE_NAMES[i], (message) => {
      const deviceData = JSON.parse(message.content.toString());
      console.log(`Device ${deviceData.deviceId} sending: ${JSON.stringify(deviceData.value)} (from queue ${QUEUE_NAMES[i]})`);
    }, { noAck: true });
  });
}

startReceivingData();
