from confluent_kafka import Consumer, KafkaException
import random
from threading import Thread

M = 30


def consumer(topic):
    consumer = Consumer({
        'bootstrap.servers': 'kafka:9092',
        'group.id': 'my-group',
        'auto.offset.reset': 'earliest'
    })
    consumer.subscribe([topic])

    while True:
        try:
            msg = consumer.poll(1.0)
            if msg is None:
                continue
            if msg.error():
                raise KafkaException(msg.error())
            print(f"Consumed message: {msg.value().decode('utf-8')}")
        except KeyboardInterrupt:
            break

    consumer.close()


if __name__ == '__main__':
    # Cambia el nombre del tópico según tus necesidades
    topic = ['topic1', 'topic2', 'topic3']
    threads = []

    for i in range(M):
        thread = Thread(target=consumer, args=(topic[i % 3]))
        thread.start()
        threads.append(thread)

    # Espera a que todos los hilos terminen
    for thread in threads:
        thread.join()
