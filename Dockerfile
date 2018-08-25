FROM python:3.6

WORKDIR /DjangoToDo
COPY . /DjangoToDo

RUN apt-get update && pip install --upgrade pip && pip install -r requirements.txt

CMD ["/DjangoToDo/docker/start.sh"]
EXPOSE 8000
