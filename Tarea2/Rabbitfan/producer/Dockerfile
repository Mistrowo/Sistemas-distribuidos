FROM python:3.9

WORKDIR /app

COPY requeriments.txt .
RUN pip install -r requeriments.txt

COPY producer.py .

CMD ["python", "producer.py"]