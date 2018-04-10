from django.contrib import admin
from .models import ToDo, ToDoUser

admin.site.register(ToDo)
admin.site.register(ToDoUser)
