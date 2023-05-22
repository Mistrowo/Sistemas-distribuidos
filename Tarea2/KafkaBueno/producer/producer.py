from confluent_kafka import Producer
import json
import time
import random
from threading import Thread

N = 10  # Número de productores
delay = 7  # Retardo de 7 segundos


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


def producer(id, topic):
    producer = create_producer()
    time.sleep(id)
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

        time.sleep(5)


if __name__ == '__main__':
    # Cambia el nombre del tópico según tus necesidades
    topic = ['topic1', 'topic2', 'topic3']
    threads = []

    for i in range(N):
        thread = Thread(target=producer, args=(i, topic[i % 3]))
        thread.start()
        threads.append(thread)

    # Espera a que todos los hilos terminen
    for thread in threads:
        thread.join()
