from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from .models import ToDoUser, ToDo
from .utils import get_or_none
from .serializers import UserSerializer

class UserRegistration(APIView):
  permission_classes = (AllowAny, )

  def post(self, requrest, **kwargs):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if get_or_none(ToDoUser, username):
        return Response({
            'message': 'Username already in use',
            'type': 'occupied_username',
        },
            status=status.HTTP_406_NOT_ACCEPTABLE
        )
    if get_or_none(ToDoUser, email):
        return Response({
            'message': 'Email already in use',
            'type': 'email_username',
        },
            status=status.HTTP_406_NOT_ACCEPTABLE
        )
    
    user = ToDoUser.objects.create(
        username=username,
        email=email
    )
    user.set_password(password)
    user.save()

    user = UserSerializer(inctance=user).data

    return Response(
        data=user
    )

