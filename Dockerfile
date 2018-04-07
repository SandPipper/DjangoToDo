FROM python:3.6

WORKDIR /DjangoToDo
COPY . /DjangoToDo

RUN apt-get update && pip install --upgrade pip && pip install -r requirements.txt

COPY docker /DjangoToDo/docker

RUN chmod -R 777 /DjangoToDo/docker/start.sh

CMD ["/DjangoToDo/docker/start.sh"]
EXPOSE 8000
