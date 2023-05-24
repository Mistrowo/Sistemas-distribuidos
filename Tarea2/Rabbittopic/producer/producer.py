import pika
import json
import time
import random
from concurrent.futures import ThreadPoolExecutor
from threading import Lock

N = 30  # Número de productores
contador = 0
topics = 1

def create_producer():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host='rabbitmq'))
    channel = connection.channel()
    channel.exchange_declare(exchange='topic_logs', exchange_type='topic')
    return channel

def producer(id, topic, lock):
    global contador
    channel = create_producer()
    while True:
        datasize = random.randint(2, 15)
        message = {
            'timestamp': time.time(),
            'value': {
                'data': ''.join(random.choice('abcdefghijklmnopqrstuvwxyz123456789') for _ in range(datasize))
            }
        }
        channel.basic_publish(
            exchange='topic_logs',
            routing_key=topic,
            body=json.dumps(message)
        )

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

