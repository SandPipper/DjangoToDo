from rest_framework import serializers
from .models import ToDoUser, ToDo


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = ToDoUser
        fields = (
            'username', 'email', 'data_created',
            'last_seen', 'auth_token', 'id', 'todos'
        )


class ToDoSerializer(serializers.ModelSerializer):

    class Meta:
        model = ToDo
        fields = (
            'title', 'status', 'data_created', 'data_start',
            'data_end', 'user.id'  
        )
