from rest_framework import permissions
from django.contrib.auth.models import AnonymousUser

class IsAnonymous(permissions.BasePermission):
	'''
	Allow only anonymous users
	'''
	def has_permission(self, request, view):
		return isinstance(request.user, AnonymousUser)