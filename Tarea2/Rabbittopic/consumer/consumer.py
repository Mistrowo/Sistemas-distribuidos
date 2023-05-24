import pika
import random
import time
from concurrent.futures import ThreadPoolExecutor

M = 3
topics = 1

def consumer(id, topic):
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host='rabbitmq'))
    channel = connection.channel()

    channel.exchange_declare(exchange='topic_logs', exchange_type='topic')

    result = channel.queue_declare('', exclusive=True)
    queue_name = result.method.queue

    channel.queue_bind(exchange='topic_logs', queue=queue_name, routing_key=topic)

    def callback(ch, method, properties, body):
        print(f"Consumed {id} message {topic}: {body.decode('utf-8')}")

    channel.basic_consume(
        queue=queue_name, on_message_callback=callback, auto_ack=True)

    try:
        channel.start_consuming()
    except KeyboardInterrupt:
        channel.stop_consuming()
        connection.close()

if __name__ == '__main__':
    # Cambia el nombre del tópico según tus necesidades
    topic = ['topic1', 'topic2', 'topic3', 'topic4', 'topic5']
    executor = ThreadPoolExecutor(max_workers=M)
    time.sleep(10)

    for i in range(M):
        executor.submit(consumer, i, topic[i % topics])

    executor.shutdown(wait=True)