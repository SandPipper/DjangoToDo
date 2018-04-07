#!/bin/bash
set -e

./manage.py migrate --no-input
./manage.py collectstatic --no-input
./manage.py runserver 0.0.0.0:8000