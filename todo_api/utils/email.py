from threading import Thread
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from todo_api.tokens import account_activation_token


class EmailThread(Thread):
    def __init__(self, subject, html_content, recipient_list):
        self.subject = subject
        self.recipient_list = recipient_list
        self.html_content = html_content
        Thread.__init__(self)
    
    def run(self):
        msg = EmailMessage(self.subject, self.html_content, to=[self.recipient_list])
        msg.send()


def send_activation_email(user, request):
    current_site = get_current_site(request)
    mail_subject = 'Activate your account.'
    message = render_to_string('acc_activate_email.html', {
        'user': user,
        'domain': current_site.domain.split(':')[0],
        'uid': urlsafe_base64_encode(force_bytes(user.pk)).decode('utf-8'),
        'token': account_activation_token.make_token(user),
    })
    to_email = user.email
    EmailThread(mail_subject, message, to_email).start()


def send_restore_password_email(user, new_password):
    mail_subject = 'Restore your password.'
    message = render_to_string('restore_password_email.html', {
        'user': user,
        'new_password': new_password
    })
    to_email = user.email
    EmailThread(mail_subject, message, to_email).start()