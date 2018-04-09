# DjangoToDo
This is a basic django api with reactjs and redux in docker

Features:
========
- Django Rest framework on backend;
- Webpack;
- Docker/Docker-compose;
- Gunicorn and Nginx as a server;

Configure docker build
======================

`cp docker/environments.example docker/environments`

For provide makemigration
============================
`sudo docker-compose up -d todo_app_pg && sudo docker-compose run todo_app_api python manage.py makemigrations NAME`

Run containers
==============
`docker-compose up` 
or
`sudo docker-compose up -d todo_app_pg && sleep 2 && sudo docker-compose up`