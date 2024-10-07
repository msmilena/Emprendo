FROM python:3.11-alpine

WORKDIR /code

COPY requirements.txt /requirements.txt

# Copia el archivo de credenciales en la imagen Docker
COPY ./app/infrastructure/credentials.json /app/credentials.json

# Establece la variable de entorno para las credenciales de Firebase
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/credentials.json
ADD ./app /code/app

RUN pip install -r /requirements.txt

EXPOSE 8000

CMD ["uvicorn", "app.main:application", "--reload", "--host", "0.0.0.0", "--port", "8000"]

