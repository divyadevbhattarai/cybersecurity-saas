from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EnclaveViewSet, SecureSessionViewSet

router = DefaultRouter()
router.register(r'enclaves', EnclaveViewSet, basename='enclaves')
router.register(r'sessions', SecureSessionViewSet, basename='sessions')

urlpatterns = [
    path('', include(router.urls)),
]
