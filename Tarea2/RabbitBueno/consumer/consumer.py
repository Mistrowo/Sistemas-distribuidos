import pika
import random
import threading
import os

NUM_CONSUMERS = int(os.environ.get('NUM_CONSUMERS', '15'))

def callback(channel, method, properties, body):
    print(body)

def consumer_thread(topic):
    connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
    channel = connection.channel()

    channel.queue_declare(queue=topic)
    channel.basic_consume(queue=topic, on_message_callback=callback, auto_ack=True)

    channel.start_consuming()

def main():
    threads = []
    for _ in range(NUM_CONSUMERS):
        topic = f'topic{random.randint(1, 3)}'
        thread = threading.Thread(target=consumer_thread, args=(topic,))
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()

if __name__ == '__main__':
    main()
