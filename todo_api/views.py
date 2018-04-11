from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from .models import ToDoUser, ToDo
from .utils import get_or_none
from .serializers import UserSerializer, ToDoSerializer


class UserRegistration(APIView):
    #TODO need add permission only for non login user
    permission_classes = (AllowAny, )

    def post(self, request, **kwargs):
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
                'type': 'occupied_email',
            },
                status=status.HTTP_406_NOT_ACCEPTABLE
            )
        
        user = ToDoUser.objects.create(
            username=username,
            email=email
        )
        user.set_password(password)
        user.save()

        user = UserSerializer(instance=user).data

        return Response(
            data=user
        )


class UserLogin(APIView):
    #TODO need add permission only for non login user
    permission_classes = (AllowAny,)

    def post(self, request, **kwargs):
        #TODO need add login by username and email
        username = request.data.get('username')
        password = request.data.get('password')
        user = get_or_none(ToDoUser, username)

        if user and user.check_password(password):
            user = UserSerializer(instance=user).data
            return Response(
                data=user
            )

        return Response({
            'message': 'Incorrect field',
            'type': 'incorrect_field',
        },
            status=status.HTTP_406_NOT_ACCEPTABLE
        )


class UserLogout(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication, )

    def get(self, request, **kwargs):
        #TODO recreate auth_token
        user = UserSerializer(request.user).data
        return Response(
            data=user
        )


class UserToDo(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)

    def get(self, request, **kwargs):
        todo = ToDo.objects.filter('id__in'==request.data.get())
        todo = ToDoSerializer(instance=todo, many=True).data
        return Response(
            data=todo
        )
    
    def post(self, request, **kwargs):
        title = request.data.get('title')
        status = request.data.get('status')
        data_start = request.data.get('data_start')
        data_end = request.data.get('data_end')
        user = request.user

        todo = ToDo.objects.create(
            title=title,
            status=status,
            data_start=data_start,
            data_end=data_end,
            user=user,
        )
        todo.save()

        todo = ToDoSerializer(instance=todo)
        return Response(
            data=todo
        )
    
    def put(self, request, **kwargs):
        #TODO
        pass
    
    def delete(self, request, **kwargs):
        #TODO
        pass
