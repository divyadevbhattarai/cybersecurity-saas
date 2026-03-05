from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RASPApplicationViewSet, RASPEventViewSet, RASPPolicyViewSet

router = DefaultRouter()
router.register(r'applications', RASPApplicationViewSet, basename='rasp-applications')
router.register(r'events', RASPEventViewSet, basename='rasp-events')
router.register(r'policies', RASPPolicyViewSet, basename='rasp-policies')

urlpatterns = [
    path('', include(router.urls)),
]
