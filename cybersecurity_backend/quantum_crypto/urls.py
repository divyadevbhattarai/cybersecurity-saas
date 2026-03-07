from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from rest_framework.decorators import action
from rest_framework import response
from .views import EncryptionKeyViewSet, KeyRotationViewSet

router = DefaultRouter()
router.register(r'encryption-keys', EncryptionKeyViewSet, basename='encryption-keys')
router.register(r'key-rotations', KeyRotationViewSet, basename='key-rotations')

urlpatterns = [
    path('', include(router.urls)),
    re_path(r'^keys/$', EncryptionKeyViewSet.as_view({'get': 'list', 'post': 'create'}), name='keys-alias'),
    re_path(r'^rotation-history/$', KeyRotationViewSet.as_view({'get': 'rotation_history'}), name='rotation-history-alias'),
    re_path(r'^algorithms/$', EncryptionKeyViewSet.as_view({'get': 'algorithms'}), name='algorithms-alias'),
]
