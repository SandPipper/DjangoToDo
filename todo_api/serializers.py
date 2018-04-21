from rest_framework import serializers
from rest_framework.validators import UniqueValidator
# from rest_framework.response import Response

from .models import ToDoUser, ToDo
from .utils import get_or_none


class UserRegistrationSerializer(serializers.ModelSerializer):

    class Meta:
        model = ToDoUser
        fields = (
            'username', 'email', 'password'
        )
    username = serializers.CharField(
        max_length=55,
        required=True,
        validators=[UniqueValidator(queryset=ToDoUser.objects.all())]
    )
    email = serializers.EmailField(
        max_length=255,
        required=True,
        validators=[UniqueValidator(queryset=ToDoUser.objects.all())]
    )
    password = serializers.CharField(
        max_length=255,
        required=True,

    )

    def create(self, validated_data):
        user = ToDoUser.objects.create(
            username=validated_data.get('username'),
            email=validated_data.get('email')
        )
        user.set_password(validated_data.get('password'))
        user.is_active = True
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = ToDoUser
        fields = (
            'username', 'email', 'date_created', 'password',
            'last_login', 'auth_token', 'id', 'todos',
            'is_active'
        )


class ToDoSerializer(serializers.ModelSerializer):

    class Meta:
        model = ToDo
        fields = (
            'title', 'status', 'date_start',
            'date_end', 'date_created'
        )
