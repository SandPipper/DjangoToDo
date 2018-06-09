# DjangoToDo
This is the base django api with various implementations of the front-end. ReactJS/redux and jQuery in different branches.

Features:
========
- Django Rest framework on backend;
- Webpack;
- Docker/Docker-compose;
- Gunicorn and Nginx as a server;
- jQuery and React/Redux in different branches;

Configure docker build
======================

`cp docker/environments.example docker/environments`

For provide makemigrations
============================
`docker-compose up -d todo_app_pg && docker-compose run todo_app_api python manage.py makemigrations`

Run containers
==============
`docker-compose up -d todo_app_pg && sleep 2 && docker-compose up`