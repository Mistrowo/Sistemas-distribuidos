# Kafka Producer and Consumer

Este proyecto incluye un Kafka Producer y un Kafka Consumer implementados en Python utilizando la biblioteca `confluent-kafka`.

## Requisitos

Asegúrate de tener Docker instalado en tu sistema antes de ejecutar los componentes de Kafka.

## Configuración

1. Copia el contenido del archivo `docker-compose.yml` y pégalo en tu propio archivo `docker-compose.yml`.
2. El archivo `docker-compose.yml` define tres servicios: `zookeeper`, `kafka`, `producer`, y `consumer`. Asegúrate de ajustar los nombres de los servicios y los puertos según tus necesidades.
3. El archivo `producer.py` contiene la implementación del Kafka Producer. Puedes personalizar la lógica del productor según tus necesidades.
4. El archivo `consumer.py` contiene la implementación del Kafka Consumer. Puedes personalizar la lógica del consumidor según tus necesidades.

## Ejecución

Sigue los pasos a continuación para ejecutar los componentes de Kafka y los consumidores/producers:

1. Abre una terminal y navega hasta la ubicación del archivo `docker-compose.yml`.
2. Ejecuta el siguiente comando para iniciar los servicios de Kafka en segundo plano:
   `docker-compose up --build`
3. Espera unos segundos para que los servicios de Kafka se inicien correctamente.

¡Ahora deberías ver los mensajes enviados por el productor y consumidos por el consumidor en la consola!

Recuerda ajustar los nombres de los servicios, los puertos y la lógica del productor/consumidor según tus necesidades.

¡Disfruta usando Kafka con Python!
