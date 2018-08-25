from rest_framework import permissions

class IsAnonymous(permissions.BasePermission):
	'''
	Allow only anonymous users
	'''
	def has_permission(self, request, view):
		return request.user.is_anonymous