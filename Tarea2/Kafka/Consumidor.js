const { Kafka } = require('kafkajs');


// Configuración del cliente de Kafka
const kafka = new Kafka({
  clientId: 'iot-consumer',
  brokers: ['localhost:9093']
});

// Creación del consumidor
const consumer = kafka.consumer({ groupId: 'iot-group' });

// Función que inicia el consumidor y se suscribe al tópico 'iot-topic'
async function runConsumer() {
  await consumer.connect();
  console.log('Connected to Kafka broker');
  await consumer.subscribe({ topic: 'iot-topic', fromBeginning: true });

  // Función que se ejecuta cada vez que se recibe un mensaje del tópico
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const messageContent = JSON.parse(message.value.toString());
      console.log(`Received message from device ${messageContent.deviceId}: ${messageContent.message}`);
    },
  });
}

// Ejecutar el consumidor
runConsumer();
