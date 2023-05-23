import pika
import json
import time
import random
from concurrent.futures import ThreadPoolExecutor
from threading import Lock

N = 3  # Número de productores
delay = 5  # Retardo de 5 segundos


def create_producer():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host='rabbitmq'))
    channel = connection.channel()
    return channel


def producer(id, topic, lock):
    channel = create_producer()
    channel.exchange_declare(exchange=topic, exchange_type='fanout')

    while True:
        datasize = random.randint(2, 15)
        message = {
            'timestamp': time.time(),
            'value': {
                'data': ''.join(random.choice('abcdefghijklmnopqrstuvwxyz123456789') for _ in range(datasize))
            }
        }

        # Adquirir el bloqueo antes de enviar el mensaje
        with lock:
            channel.basic_publish(exchange=topic, routing_key='',
                                  body=json.dumps(message))
            print(f'Device {id} sending: {json.dumps(message)}')

        time.sleep(0)


if __name__ == '__main__':
    # Cambia el nombre del tópico según tus necesidades
    topic = ['topic1', 'topic2', 'topic3']
    lock = Lock()
    executor = ThreadPoolExecutor(max_workers=N)
    time.sleep(10)

    for i in range(N):
        executor.submit(producer, i, topic[i % 3], lock)

    executor.shutdown(wait=True)