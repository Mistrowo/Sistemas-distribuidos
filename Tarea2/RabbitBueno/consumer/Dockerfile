FROM python:3.9

WORKDIR /app

RUN pip install --no-cache-dir requirements.txt

COPY consumer.py .

CMD [ "python", "consumer.py" ]
