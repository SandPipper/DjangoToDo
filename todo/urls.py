from django.contrib import admin
from django.urls import path
from todo_api import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', views.UserRegistration.as_view()),
    path('auth/login/', views.UserLogin.as_view()),
    path('auth/logout/', views.UserLogout.as_view()),
    path('todo/', views.UserToDo.as_view()),
    path('activate-user/', views.ActivateView.as_view()),
    path('restore-password/', views.RestorePassword.as_view())
]
