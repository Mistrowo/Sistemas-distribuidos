from confluent_kafka import Producer
import json
import time
import random
from concurrent.futures import ThreadPoolExecutor
from threading import Lock

N = 30  # Número de productores
contador = 0
topics = 1


def delivery_report(err, msg):
    if err is not None:
        print(f'Message delivery failed: {err}')
    else:
        print(f'Message delivered to {msg.topic()} [{msg.partition()}]')


def create_producer():
    # Configura los parámetros de conexión a Kafka
    conf = {'bootstrap.servers': 'kafka:9092'}

    # Crea el productor
    producer = Producer(conf)
    return producer


def producer(id, topic, lock):
    global contador
    producer = create_producer()
    while True:
        datasize = random.randint(2, 15)
        message = {
            'timestamp': time.time(),
            'value': {
                'data': ''.join(random.choice('abcdefghijklmnopqrstuvwxyz123456789') for _ in range(datasize))
            }
        }
        producer.produce(topic, key=str(id), value=json.dumps(
            message), callback=delivery_report)
        producer.flush()

        print(f'Device {id} sending: {json.dumps(message)}')

        # Adquirir el bloqueo antes de enviar el mensaje
        with lock:
            contador += 1
            if contador > N:
                # Rafaga cada 2 segundos
                time.sleep(2)
                contador = 0


if __name__ == '__main__':
    # Cambia el nombre del tópico según tus necesidades
    topic = ['topic1', 'topic2', 'topic3', 'topic4', 'topic5']
    lock = Lock()
    executor = ThreadPoolExecutor(max_workers=N)
    time.sleep(10)

    for i in range(N):
        executor.submit(producer, i, topic[i % topics], lock)

    executor.shutdown(wait=True)
