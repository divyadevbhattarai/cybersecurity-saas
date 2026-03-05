from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EncryptionKeyViewSet, KeyRotationViewSet

router = DefaultRouter()
router.register(r'encryption-keys', EncryptionKeyViewSet, basename='encryption-keys')
router.register(r'key-rotations', KeyRotationViewSet, basename='key-rotations')

urlpatterns = [
    path('', include(router.urls)),
]
