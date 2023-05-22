from confluent_kafka import Consumer, KafkaException
import random
import time
from concurrent.futures import ThreadPoolExecutor

M = 3
topics = 1


def consumer(id, topic):
    consumer = Consumer({
        'bootstrap.servers': 'kafka:9092',
        'group.id': str(id),
        'auto.offset.reset': 'earliest'
    })
    consumer.subscribe([topic])

    while True:
        try:
            msg = consumer.poll(0)
            if msg is None:
                continue
            if msg.error():
                raise KafkaException(msg.error())
            print(
                f"Consumed {id} message {topic}: {msg.value().decode('utf-8')}")
        except KeyboardInterrupt:
            break

    consumer.close()


if __name__ == '__main__':
    # Cambia el nombre del tópico según tus necesidades
    topic = ['topic1', 'topic2', 'topic3', 'topic4', 'topic5']
    executor = ThreadPoolExecutor(max_workers=M)
    time.sleep(10)

    for i in range(M):
        executor.submit(consumer, i, topic[i % topics])

    executor.shutdown(wait=True)
