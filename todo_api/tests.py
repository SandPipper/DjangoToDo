from django.test import TestCase
import requests
from rest_framework.test import APITestCase, APITransactionTestCase
from .models import ToDoUser
from .views import UserRegistration


class UserRegistrationTest(APITransactionTestCase):
    serialized_rollback = True
    
    def setUp(self):
        self.url = 'http://localhost:8000/auth/'
    
    def _client_post(self, username='', email='', password=''):
        return self.client.post(self.url, {
            'username': username,
            'email': email,
            'password': password
        }, format='json')
    
    def test_success_user_registration_view(self):
        response = self._client_post(
            username='Testovich',
            email='testovich@test.com',
            password='12345abcd'
            )
        user = ToDoUser.objects.get(username='Testovich')
        self.assertTrue(user)
        self.assertEqual(response.data['username'], 'Testovich')
    
    def test_occupied_username_registration_view(self):
        response = self._client_post(
            username='Testovich',
            email='testovich@test.com',
            password='12345abcd'
        )
        response = self._client_post(
            username='Testovich',
            email='testovich2@test.com',
            password='12345abcd'
        )
        self.assertEqual(response.data['type'], 'username_occupied')
    
    def test_occupied_email_registration_view(self):
        response = self._client_post(
            username='Testovich',
            email='testovich@test.com',
            password='12345abcd'
        )
        response = self._client_post(
            username='Testovich',
            email='testovich@test.com',
            password='12345abcd'
        )
        self.assertEqual(response.data['type'], 'email_occupied')
    
    def test_fail_username_registration_view(self):
        response = self._client_post(
            email='testovich@test.com',
            password='12345abcd'
        )
        self.assertEqual(response.data['type'], 'validation_failed')
    
    def test_fail_email_registration_view(self):
        response = self._client_post(
            username='Testovich',
            password='12345abcd'
        )
        self.assertEqual(response.data['type'], 'validation_failed')
    
    def test_fail_password_registration_view(self):
        response = self._client_post(
            username='Testovich',
            email='testovich@test.com'
        )
        self.assertEqual(response.data['type'], 'password_required')
