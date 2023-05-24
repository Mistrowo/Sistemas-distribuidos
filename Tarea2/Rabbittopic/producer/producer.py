import json
import pika
import time
import random
from concurrent.futures import ThreadPoolExecutor
from threading import Lock

N = 30  # Número de productores
contador = 0
nombre = 1
exchange_type = 'topic'  # Cambia esto a 'direct' o 'topic' para pro otros patrones de intercambio

def create_producer():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host='rabbitmq'))
    channel = connection.channel()
    return channel

def producer(id, topic, lock):
    channel = create_producer()
    channel.exchange_declare(exchange=topic, exchange_type=exchange_type)

    while True:
        datasize = random.randint(2, 15)
        message = {
            'timestamp': time.time(),
            'value': {
                'data': ''.join(random.choice('abcdefghijklmnopqrstuvwxyz123456789') for _ in range(datasize))
            }
        }
        routing_key = ''
        
        if exchange_type == 'topic':
            routing_key = f'topic_key.{id}'  # Añade una clave de enrutamiento única para cada productor
        
        channel.basic_publish(exchange=topic, routing_key=routing_key, body=json.dumps(message))
        print(f'Device {id} sending: {json.dumps(message)}')
        global contador
        with lock:
            contador += 1
            if contador > N:
                time.sleep(2)
                contador = 0

if __name__ == '__main__':
   topic = ['topic1', 'topic2', 'topic3', 'topic4', 'topic5']
   executor = ThreadPoolExecutor(max_workers=N)
   time.sleep(10)

   for i in range(N):
        executor.submit(producer, i, topic[i % nombre])

   executor.shutdown(wait=True)