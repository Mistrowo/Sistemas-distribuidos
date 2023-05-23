import pika
import random
import time
from concurrent.futures import ThreadPoolExecutor

M = 3

def consumer(id, topic):
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host='rabbitmq'))
    channel = connection.channel()

    channel.exchange_declare(exchange=topic, exchange_type='fanout')

    result = channel.queue_declare(queue='', exclusive=True)
    queue_name = result.method.queue

    channel.queue_bind(exchange=topic, queue=queue_name)

    print(f'Consumer {id} waiting for messages in topic {topic}. To exit press CTRL+C')

    def callback(ch, method, properties, body):
        print(f"Consumed {id} message topic {topic}: {body.decode('utf-8')}")

    channel.basic_consume(
        queue=queue_name, on_message_callback=callback, auto_ack=True)

    try:
        channel.start_consuming()
    except KeyboardInterrupt:
        channel.stop_consuming()
        connection.close()

if __name__ == '__main__':
    # Cambia el nombre del tópico según tus necesidades
    topic = ['topic1', 'topic2', 'topic3']
    executor = ThreadPoolExecutor(max_workers=M)
    time.sleep(10)

    for i in range(M):
        executor.submit(consumer, i, topic[i % 3])

    executor.shutdown(wait=True)