from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import ToDoUser, ToDo, ToDoUserManager
from .serializers import UserRegistrationSerializer, UserSerializer, ToDoSerializer
from .tokens import account_activation_token
from .permissions import IsAnonymous
from .utils import get_or_none, send_activation_email, send_restore_password_email


class UserRegistration(APIView):
    permission_classes = (IsAnonymous,)
    def post(self, request, **kwargs):
        serializer = UserRegistrationSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serialized_user = serializer.save()
            return Response(
                data=serialized_user
            )
        return Response({
            'message': serializer.errors,
            'type': 'incorrect_field',
        },
            status=status.HTTP_406_NOT_ACCEPTABLE
        )


class ActivateView(APIView):
    permission_classes = (AllowAny,)
    def get(self, request, **kwargs):
        user = ToDoUser.objects.get(email=request.query_params['email'])
        send_activation_email(user, request)
        return Response(
            status=200
        )

    def post(self, request, **kwargs):
        try:
            uid = force_text(urlsafe_base64_decode(request.data.get('uibd64')))
            token = request.data.get('token')
            user = ToDoUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, ToDoUser.DoesNotExist) as e:
            print('errr!', e)
            user = None

        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            serializer = UserSerializer(instance=user).data
            return Response(
                data=serializer
            )
        return Response(
            status=401
        )


class RestorePassword(APIView):
    permission_classes = (IsAnonymous,)

    def post(self, request, **kwargs):
        email = request.data.get('email')
        user = get_or_none(ToDoUser, email=email)
        if user:
            user_manager = ToDoUserManager()
            password = user_manager.make_random_password()
            user.set_password(password)
            user.save()
            send_restore_password_email(user, password)
            return Response(
                data='ok'
            )
        return Response({
            'message': 'Invalid email',
            'type': 'incorrect_field',
        },
            status=status.HTTP_406_NOT_ACCEPTABLE
        )


class UserLogin(APIView):
    permission_classes = (IsAnonymous,)

    def post(self, request, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = get_or_none(ToDoUser, username=username) or get_or_none(ToDoUser, email=username)

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

    def get(self, request, **kwargs):
        todos = ToDo.objects.filter(user=request.user)
        serializer = ToDoSerializer(instance=todos, many=True).data
        serializer.insert(0, ToDo.TYPES)
        return Response(
            data=serializer
        )

    def post(self, request, **kwargs):
        serializer = ToDoSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            serializer = ToDoSerializer(instance=ToDo.objects.filter(user=request.user), many=True).data
            serializer.insert(0, ToDo.TYPES)
            return Response(
            data=serializer
            )
        return Response({
            'message': serializer.errors,
            'type': 'incorrect_field',
        },
            status=status.HTTP_406_NOT_ACCEPTABLE
        )

    def put(self, request, **kwargs):
        serializer = ToDoSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            todo = ToDo.objects.get(id=request.data.get('id'))
            serializer.update(todo, serializer.validated_data)
            todo = ToDoSerializer(instance=todo).data

            return Response(
                data=todo
            )
        return Response(
            data=serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, **kwargs):
        todo_id = request.data.get('id')

        todo_rm = ToDo.objects.filter(id=todo_id).first()

        if todo_rm:
            todo_rm.delete()

            return Response({
                'message': 'delete',
                'type': 'success',
            })
            
        return Response({
            'message': 'error',
            'type': 'fail'
            },
            status=status.HTTP_400_BAD_REQUEST
        )
