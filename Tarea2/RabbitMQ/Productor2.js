const amqp = require('amqplib');
const faker = require('faker');

// Configuración de RabbitMQ
const RABBITMQ_URL = 'amqp://localhost';
const QUEUE_NAME = 'iot_devices_queue';

// Función para conectarse al servidor RabbitMQ y retornar el canal
async function connectToRabbitMQ() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: false });
  return channel;
}

// Función para generar un mensaje aleatorio en formato JSON
function generateMessage(deviceId, messageSize) {
  return {
    deviceId: deviceId,
    timestamp: Date.now(),
    value: faker.random.alphaNumeric(messageSize)
  }
}

// Función que envía un mensaje al servidor RabbitMQ
async function sendMessage(channel, deviceId, messageSize) {
  const message = generateMessage(deviceId, messageSize);
  const content = Buffer.from(JSON.stringify(message));
  await channel.sendToQueue(QUEUE_NAME, content);
  console.log(`Device ${deviceId} sent message: ${JSON.stringify(message)}`);
}

// Función que simula un dispositivo IoT enviando mensajes cada cierto tiempo
async function simulateDevice(channel, deviceId, interval, messageSize) {
  while (true) {
    await sendMessage(channel, deviceId, messageSize);
    await new Promise(resolve => setTimeout(resolve, interval));
  }
}

// Función que inicia la conexión al servidor RabbitMQ y comienza a simular dispositivos IoT
async function runProducer(numDevices, interval, messageSize) {
  const channel = await connectToRabbitMQ();
  console.log(`Connected to RabbitMQ server. Waiting for messages on queue ${QUEUE_NAME}.`);
  for (let i = 0; i < numDevices; i++) {
    simulateDevice(channel, i, interval, messageSize);
  }
}

// Ejecutar el productor
runProducer(3, 1000, 10);
