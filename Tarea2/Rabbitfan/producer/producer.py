import json
import time
import random
import pika
from concurrent.futures import ThreadPoolExecutor
from threading import Lock

N = 50 # Número de productores
contador = 0
nombre = 1
exchange_type = 'fanout'  # Cambia esto a 'fanout'

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
        
        channel.basic_publish(exchange=topic, routing_key='', body=json.dumps(message))  # Elimina la clave de enrutamiento
        print(f'Device {id} sending: {json.dumps(message)}')
        global contador
        with lock:
            contador += 1
            if contador > N:
                time.sleep(2)
                contador = 0

if __name__ == '__main__':
    exchange_name = ['exchange1', 'exchange2', 'exchange3', 'exchange4', 'exchange5']
    lock = Lock()
    executor = ThreadPoolExecutor(max_workers=N)
    time.sleep(10)

    for i in range(N):
        executor.submit(producer, i, exchange_name[i % nombre], lock)

    executor.shutdown(wait=True)


    