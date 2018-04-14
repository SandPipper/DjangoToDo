from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from django.utils import timezone
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework.authtoken.models import Token


class ToDoUserManager(BaseUserManager):
    def create_user(self, username):
        if not username:
            raise ValueError('Users must have an username')
        user = self.model(
            username=username,
        )
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password):
        user = self.create_user(username)
        user.is_admin = True
        user.is_staff = True
        user.is_active = True
        user.is_superuser = True
        user.set_password(password)
        user.save(using=self._db)
        return user


class ToDoUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=55, unique=True)
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)

    date_created = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'username'
    objects = ToDoUserManager()

    def get_todos(self):
        return self.todos
    
    def save(self, *args, **kwargs):
        validate_email(self.email)
        if not self.username:
            raise ValidationError('Username is required')
        super(ToDoUser, self).save(*args, **kwargs)

    def __str__(self):
        return f'<{self.username}, {self.email}, {self.date_created}>'


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


class ToDo(models.Model):
    TYPES = (
        ('Started', 'Started'),
        ('Not Started', 'Not Started'),
        ('Ended', 'Ended'),
    )

    title = models.CharField(max_length=300)
    status = models.CharField(max_length=30, choices=TYPES)

    date_created = models.DateTimeField(default=timezone.now)
    date_start = models.DateTimeField()
    date_end = models.DateTimeField()

    user = models.ForeignKey(ToDoUser,
                             related_name='todos',
                             on_delete=models.CASCADE)
    
    def __str__(self):
        return f'<{self.title}, {self.status}, {self.user.username}>'
