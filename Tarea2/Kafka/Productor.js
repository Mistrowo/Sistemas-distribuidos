const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'iot-producer',
  brokers: ['9092:9092']
});

const producer = kafka.producer();

function generateMessage(deviceId, messageSize) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let message = '';
  for (let i = 0; i < messageSize; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    message += characters.charAt(randomIndex);
  }
  return {
    timestamp: Date.now(),
    value: {
      data: message
    }
  };
}

async function sendMessage(deviceId, messageSize) {
  const message = generateMessage(deviceId, messageSize);
  await producer.send({
    topic: 'iot-topic',
    messages: [
      { value: JSON.stringify(message) }
    ]
  });
  console.log(`Device ${deviceId} sending: ${JSON.stringify(message)}`);
}

async function simulateDevice(deviceId, interval, messageSize, numIterations) {
  for (let i = 0; i < numIterations; i++) {
    await sendMessage(deviceId, messageSize);
    await new Promise(resolve => setTimeout(resolve, interval));
  }
}

async function runProducer(numDevices, interval, messageSize) {
  await producer.connect();
  console.log('Connected to Kafka broker');
  for (let i = 0; i < numDevices; i++) {
    simulateDevice(i, interval, messageSize, 10);
  }
}

runProducer(3, 5000, 10);
