from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from django.core.exceptions import ValidationError
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
        
        try:
            user = ToDoUser.objects.create(
                username=username,
                email=email
            )
            user.set_password(password)
            user.save()
        except ValidationError as e:
            #TODO check this and add custom validators from django.core.validators
            return Response({
                'message': f'{e.error_dict}',
                'type': 'validation_failed',
            },
                status=status.HTTP_406_NOT_ACCEPTABLE
            )

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
        todos = ToDo.objects.filter('user'==request.user)
        todos = ToDoSerializer(instance=todos, many=True).data
        return Response(
            data=todos
        )
    
    def post(self, request, **kwargs):
        title = request.data.get('title')
        status = request.data.get('status')
        date_start = request.data.get('data_start')
        date_end = request.data.get('data_end')
        user = request.user
        try:
            todo = ToDo.objects.create(
                title=title,
                status=status,
                date_start=date_start,
                date_end=date_end,
                user=user,
            )
            todo.save()
        except ValidationError as e:
            #TODO check this and add custom validators from django.core.validators
            return Response({
                'message': f'{e.error_dict}',
                'type': 'validation_failed',
            },
                status=status.HTTP_406_NOT_ACCEPTABLE
            )

        todo = ToDoSerializer(instance=todo).data
        return Response(
            data=todo
        )
    
    def put(self, request, **kwargs):
        id = request.gata.get('id')
        title = request.data.get('title')
        status = request.data.get('status')
        date_start = request.data.get('data_start')
        date_end = request.data.get('data_end')

        try:
            todo = Todo.objects.get(id=id).update(
                title=title, 
                status=status, 
                date_start=date_start, 
                date_end=date_end
            )
        except ValidationError as e:
            #TODO check this and add custom validators from django.core.validators
            return Response({
                'message': f'{e.error_dict}',
                'type': 'validation_failed',
            },
                status=status.HTTP_406_NOT_ACCEPTABLE
            )

        todo = ToDoSerializer(instance=todo).data

        return Response(
            data=data
        )
    
    def delete(self, request, **kwargs):
        id = request.data.get('id')
        try:
            ToDo.objects.get(id=id).delete()
        except Exception as e:
            return Response({
                'message': f'{e.error_dict}',
                'type': 'wrong_id',
            },
                status=status.HTTP_406_NOT_ACCEPTABLE
            )
        return Response({
            'message': 'delete',
            'type': 'success',
        })
