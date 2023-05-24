FROM python:3.9

WORKDIR /app

COPY requeriments.txt .
RUN pip install -r requeriments.txt

COPY consumer.py .

CMD ["python", "consumer.py"]