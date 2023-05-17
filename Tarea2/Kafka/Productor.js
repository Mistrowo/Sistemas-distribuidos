const { Kafka } = require('kafkajs');


// Configuración del cliente de Kafka
const kafka = new Kafka({
  clientId: 'iot-producer',
  brokers: ['localhost:9092']
});

// Creación del productor
const producer = kafka.producer();

// Función para generar un mensaje aleatorio en formato JSON
function generateMessage(deviceId, messageSize) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let message = '';
  for (let i = 0; i < messageSize; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    message += characters.charAt(randomIndex);
  }
  return {
    deviceId: deviceId,
    timestamp: Date.now(),
    message: message
  };
}

// Función que envía un mensaje al tópico 'iot-topic'
async function sendMessage(deviceId, messageSize) {
  const message = generateMessage(deviceId, messageSize);
  await producer.send({
    topic: 'iot-topic',
    messages: [
      { value: JSON.stringify(message) }
    ]
  });
  console.log(`Device ${deviceId} sent message: ${JSON.stringify(message)}`);
}

// Función que simula un dispositivo IoT enviando mensajes cada cierto tiempo
async function simulateDevice(deviceId, interval, messageSize, numIterations) {
  for (let i = 0; i < numIterations; i++) {
    await sendMessage(deviceId, messageSize);
    await new Promise(resolve => setTimeout(resolve, interval));
  }
}

// Función que inicia el productor y comienza a simular dispositivos IoT
async function runProducer(numDevices, interval, messageSize) {
  await producer.connect();
  console.log('Connected to Kafka broker');
  for (let i = 0; i < numDevices; i++) {
    simulateDevice(i, interval, messageSize, 10); // Cambia el último argumento según tus necesidades
  }
}

// Ejecutar el productor con 3 dispositivos, un intervalo de 1ms y un tamaño de mensaje de 10
runProducer(3, 1000, 10);
