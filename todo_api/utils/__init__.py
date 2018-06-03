from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError

from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from todo_api.tokens import account_activation_token


def get_or_none(model, *args, **kwargs):
    '''
    Retreive single object from database or None.
    :param model: Django model
    :param kwargs: Request filters.
    :return:
    '''
    try:
        return model.objects.get(*args, **kwargs)
    except model.DoesNotExist:
        return


def validation_handler(func):
    def wrapper(self, request, **kwargs):
        try:
            return func(self, request, **kwargs)
        except ValidationError as e:
            return Response({
                'message': e.messages[0],
                'type': 'validation_failed',
            },
            status=status.HTTP_406_NOT_ACCEPTABLE,
            )
        except IntegrityError as e:
            #TODO find a better way
            print('====test===')
            print(e)
            # field = str(e).split('.')[-1]
            field = str(e.__context__).split('(')[1][:-2]
            return Response({
                'message': f'{field} allready in use.',
                'type': f'{field}_occupied',
            },
            status=status.HTTP_406_NOT_ACCEPTABLE,
            )
    return wrapper


def send_activation_email(user, request):
    #TODO implement this asynchronously
    current_site = get_current_site(request)
    mail_subject = 'Activate your account.'
    message = render_to_string('acc_activate_email.html', {
        'user': user,
        'domain': current_site.domain.split(':')[0],
        'uid': urlsafe_base64_encode(force_bytes(user.pk)).decode('utf-8'),
        'token': account_activation_token.make_token(user),
    })
    to_email = user.email
    email = EmailMessage(
        mail_subject, message, to=[to_email]
    )
    email.send()
