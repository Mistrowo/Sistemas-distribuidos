const axios = require('axios')
const IoTDevice = require('./dataytime');

const n = 3; // Number of devices
const dt = 5000; // Time interval in milliseconds

const devices = [];

const sendMessage = async (message) => {
  try {
    const response = await axios.post('http://localhost:3000/messages', {
      message: message
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error sending message:', error.message);
  }
};

for (let i = 0; i < n; i++) {
  const device = new IoTDevice(i, dt);
  devices.push(device);
  device.start();
}

devices.forEach((device) => {
  device.on('data', (message) => {
    // Llamada a la función para enviar un mensaje
    sendMessage(message);
  });
});


