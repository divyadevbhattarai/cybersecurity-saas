from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import User
from django.core.cache import cache


class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="SecureP@ssw0rd!"
        )
        cache.clear()

    def test_user_creation(self):
        self.assertEqual(self.user.username, "testuser")
        self.assertEqual(self.user.email, "test@example.com")
        self.assertTrue(self.user.check_password("SecureP@ssw0rd!"))

    def test_user_str(self):
        self.assertEqual(str(self.user), "testuser")


class RegisterViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse("register")
        cache.clear()

    def test_register_valid_data(self):
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "SecureP@ssw0rd!"
        }
        response = self.client.post(self.register_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="newuser").exists())

    def test_register_invalid_data(self):
        data = {
            "username": "",
            "email": "invalid-email",
            "password": "WeakPass1!"
        }
        response = self.client.post(self.register_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LoginViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.login_url = reverse("login")
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="SecureP@ssw0rd!"
        )
        cache.clear()

    def test_login_valid_credentials(self):
        data = {
            "username": "testuser",
            "password": "SecureP@ssw0rd!"
        }
        response = self.client.post(self.login_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data["data"])
        self.assertIn("refresh", response.data["data"])

    def test_login_invalid_credentials(self):
        data = {
            "username": "testuser",
            "password": "wrongpassword"
        }
        response = self.client.post(self.login_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_nonexistent_user(self):
        data = {
            "username": "nonexistent",
            "password": "somepassword"
        }
        response = self.client.post(self.login_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
