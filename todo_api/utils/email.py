from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from todo_api.tokens import account_activation_token


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