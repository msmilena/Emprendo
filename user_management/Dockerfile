FROM python:3.11-alpine

WORKDIR /user_management

COPY requirements.txt /user_management/requirements.txt

ADD ./app /user_management/app

RUN pip install -r /user_management/requirements.txt

EXPOSE 8080

CMD ["uvicorn", "app.main:application", "--reload", "--host", "0.0.0.0", "--port", "8080"]