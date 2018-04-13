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

For provide makemigrations
============================
`docker-compose up -d todo_app_pg && docker-compose run todo_app_api python manage.py makemigrations`

Run containers
==============
`docker-compose up` 
or
`docker-compose up -d todo_app_pg && sleep 2 && docker-compose up`