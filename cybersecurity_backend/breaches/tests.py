from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from users.models import Tenant
from security.middleware import TenantContext
from .models import Breach

User = get_user_model()


class BreachModelTest(TestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(
            name="Test Tenant",
            slug="test-tenant"
        )
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="SecureP@ssw0rd!",
            tenant=self.tenant
        )
        self.breach = Breach.objects.create(
            name="Test Breach",
            description="A test breach description",
            status="open",
            tenant=self.tenant
        )

    def test_breach_creation(self):
        self.assertEqual(self.breach.name, "Test Breach")
        self.assertEqual(self.breach.status, "open")

    def test_breach_str(self):
        self.assertEqual(str(self.breach), "Test Breach")


class BreachAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tenant = Tenant.objects.create(
            name="Test Tenant",
            slug="test-tenant"
        )
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="SecureP@ssw0rd!",
            tenant=self.tenant
        )
        self.client.force_authenticate(user=self.user)
        TenantContext.set_tenant(self.tenant.id, self.tenant.slug)
        self.breach = Breach.objects.create(
            name="Test Breach",
            description="Test description",
            status="open",
            tenant=self.tenant
        )

    def tearDown(self):
        TenantContext.clear()

    def test_list_breaches(self):
        response = self.client.get("/api/v1/breaches/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_breach(self):
        data = {
            "name": "New Breach",
            "description": "New description",
            "status": "open"
        }
        response = self.client.post("/api/v1/breaches/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_breach(self):
        response = self.client.get(f"/api/v1/breaches/{self.breach.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_breach(self):
        data = {
            "name": "Updated Breach",
            "description": "Updated description",
            "status": "resolved"
        }
        response = self.client.put(
            f"/api/v1/breaches/{self.breach.id}/",
            data,
            format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_breach(self):
        response = self.client.delete(f"/api/v1/breaches/{self.breach.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
