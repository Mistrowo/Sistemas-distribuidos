const express = require('express');
const bodyParser = require('body-parser');
const kafka = require('kafka-node');

const app = express();
app.use(bodyParser.json());

const client = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' });
const producer = new kafka.Producer(client);

producer.on('ready', () => {
  console.log('Kafka producer is ready');
});

producer.on('error', (err) => {
  console.error('Error with Kafka producer:', err);
});

app.post('/messages', (req, res) => {
  console.log('Recibido: ', req.body.message);
  const message = req.body.message;

  const payload = [
    {
      topic: 'iot_data',
      messages: JSON.stringify(message),
      partition: 0
    }
  ];

  producer.send(payload, (err, data) => {
    if (err) {
      console.error('Error sending message:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      console.log('Message sent:', data);
      res.status(200).json({ message: 'Message sent successfully' });
    }
  });
});

app.listen(3000, () => {
  console.log('Producer server listening on port 3000');
});
