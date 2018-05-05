from django.utils import timezone
from datetime import datetime

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
        min_length=2,
        validators=[UniqueValidator(queryset=ToDoUser.objects.all())]
    )
    email = serializers.EmailField(
        max_length=255,
        validators=[UniqueValidator(queryset=ToDoUser.objects.all())]
    )
    password = serializers.CharField(
        max_length=255,
        min_length=4
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
            'username', 'email', 'date_created',
            'last_login', 'auth_token', 'id', 'todos',
            'is_active'
        )


class ToDoSerializer(serializers.ModelSerializer):

    class Meta:
        model = ToDo
        fields = (
            'title', 'status', 'date_start',
            'date_end', 'date_created', 'user'
        )
        read_only_fields = ('date_created',)

    status = serializers.SerializerMethodField()

    title = serializers.CharField(
        max_length=30,
        min_length=3,
        validators=[UniqueValidator(queryset=ToDo.objects.all())]
    )

    date_start = serializers.DateField()
    date_end = serializers.DateField()

    user = serializers.PrimaryKeyRelatedField(queryset=ToDoUser.objects.all(), default=serializers.CurrentUserDefault())
    

    def get_status(self, obj):
        date_now = datetime.date(datetime.now())
        if obj.date_start >= date_now and obj.date_end > date_now:
            return ToDo.TYPES[0][0]
        elif obj.date_start < date_now:
            return ToDo.TYPES[1][0]
        elif obj.date_end < date_now:
            return ToDo.TYPES[2][0]

