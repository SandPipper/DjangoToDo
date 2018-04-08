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

Run containers
==============
`docker-compose up` 
or
`sudo docker-compose up -d todo_app_pg && sleep 2 && sudo docker-compose up`