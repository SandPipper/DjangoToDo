from django.contrib import admin
from .models import ToDo, ToDoUser

#TODO add more functionality to admin panel
admin.site.register(ToDo)
admin.site.register(ToDoUser)
