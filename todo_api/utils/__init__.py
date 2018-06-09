from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError

from .email import send_activation_email

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

