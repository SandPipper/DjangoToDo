from django.test import TestCase
import requests
from rest_framework.test import RequestsClient
from .models import ToDoUser
from .views import UserRegistration


class UserRegistrationTest(TestCase):
    def setUp(self):
        self.client = RequestsClient()
        self.url = 'http://localhost:8000/auth/login/'
    
    def _client_post(self, username='', email='', password=''):
        return self.client.post(self.url, {
            'username': username,
            'email': email,
            'password': password
        })
    
    def test_success_user_registration_view(self):
        #TODO fix 500 on server
        response = self._client_post(
            username='Testovich',
            email='testovich@test.com',
            password='12345abcd'
            )
        self.assertEqual(response.status_code, 200)
    
    def test_fail_username_registration_view(self):
        response = self._client_post(
            email='testovich@test.com',
            password='12345abcd'
        )
        self.assertEqual(response.status_code, 406)
    
    def test_fail_email_registration_view(self):
        response = self._client_post(
            username='Testovich',
            password='12345abcd'
        )
        self.assertEqual(response.status_code, 406)
    
    def test_fail_password_registration_view(self):
        response = self._client_post(
            username='Testovich',
            email='testovich@test.com'
        )
        self.assertEqual(response.status_code, 406)

