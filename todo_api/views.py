from datetime import datetime
from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError
from .models import ToDoUser, ToDo
from .utils import get_or_none, validation_handler
from .serializers import UserRegistrationSerializer, UserSerializer, ToDoSerializer


class UserRegistration(APIView):
    #TODO need add permission only for non login user
    permission_classes = (AllowAny, )
    def post(self, request, **kwargs):
        #TODO add email confirmation
        #TODO add password restore by email
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            user = UserSerializer(
                instance=ToDoUser.objects.get(
                    username=request.data.get('username')
                )
            )
            return Response(
                data=user.data
            )
        else:
            return Response(
                data=serializer.errors
            )


class UserLogin(APIView):
    #TODO need add permission only for non login user
    permission_classes = (AllowAny,)

    def post(self, request, **kwargs):
        #TODO need add login by username and email
        username = request.data.get('username')
        password = request.data.get('password')
        user = get_or_none(ToDoUser, username=username)

        if user and user.check_password(password):
            user = UserSerializer(instance=user).data
            return Response(
                data=user
            )

        return Response({
            'message': 'Invalid username or password field',
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

    @validation_handler
    def get(self, request, **kwargs):
        todos = ToDo.objects.filter(user=request.user)
        todos = ToDoSerializer(instance=todos, many=True).data
        return Response(
            data=todos
        )

    @validation_handler
    def post(self, request, **kwargs):
        title = request.data.get('title')
        status = request.data.get('status')
        date_start = request.data.get('date_start')
        date_end = request.data.get('date_end')
        user = request.user

        todo = ToDo.objects.create(
            title=title,
            status=status,
            date_start=date_start, # datetime.strptime(date_start, '%m/%d/%Y').date(),
            date_end=date_end, # datetime.strptime(date_start, '%m/%d/%Y').date(),
            user=user,
        )
        todo.save()

        todo = ToDoSerializer(instance=todo)

        return Response(
            data=todo
        )

    @validation_handler
    def put(self, request, **kwargs):
        id = request.gata.get('id')
        title = request.data.get('title')
        status = request.data.get('status')
        date_start = request.data.get('date_start')
        date_end = request.data.get('date_end')

        todo = Todo.objects.get(id=id).update(
            title=title,
            status=status,
            date_start=date_start,
            date_end=date_end
        )

        todo = ToDoSerializer(instance=todo).data

        return Response(
            data=todo
        )

    @validation_handler
    def delete(self, request, **kwargs):
        id = request.data.get('id')

        ToDo.objects.get(id=id).delete()

        return Response({
            'message': 'delete',
            'type': 'success',
        })
