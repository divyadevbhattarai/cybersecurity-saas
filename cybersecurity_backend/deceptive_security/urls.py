from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HoneypotViewSet, CanaryTokenViewSet, ThreatHuntViewSet

router = DefaultRouter()
router.register(r'honeypots', HoneypotViewSet, basename='honeypots')
router.register(r'canary-tokens', CanaryTokenViewSet, basename='canary-tokens')
router.register(r'threat-hunts', ThreatHuntViewSet, basename='threat-hunts')

urlpatterns = [
    path('', include(router.urls)),
]
