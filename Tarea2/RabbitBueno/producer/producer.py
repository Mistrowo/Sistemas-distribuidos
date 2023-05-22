import pika
import random
import time
import threading
import os

NUM_PRODUCERS = int(os.environ.get('NUM_PRODUCERS', '10'))
DELAY_SECONDS = int(os.environ.get('DELAY_SECONDS', '7'))

def send_message(channel, device_id, topic):
    message = f'Device {device_id} sending: {{"timestamp": 1652224056.2431426, "value": {{"data": "m8LPcUxltBnck"}}}}'
    channel.basic_publish(exchange='', routing_key=topic, body=message)
    print(message)

def producer_thread(device_id, topic):
    connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
    channel = connection.channel()

    channel.queue_declare(queue=topic)

    while True:
        send_message(channel, device_id, topic)
        time.sleep(DELAY_SECONDS)

def main():
    threads = []
    for device_id in range(NUM_PRODUCERS):
        topic = f'topic{random.randint(1, 3)}'
        thread = threading.Thread(target=producer_thread, args=(device_id, topic))
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()

if __name__ == '__main__':
    main()
