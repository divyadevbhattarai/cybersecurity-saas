from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BiometricProfileViewSet, Web3IdentityViewSet,
    ZTNAProfileViewSet, AccessRequestViewSet,
    MicroSegmentViewSet, DeviceTrustViewSet,
    SessionMonitoringViewSet, JITAccessViewSet
)

router = DefaultRouter()
router.register(r'biometrics', BiometricProfileViewSet, basename='biometrics')
router.register(r'web3-identity', Web3IdentityViewSet, basename='web3-identity')
router.register(r'profiles', ZTNAProfileViewSet, basename='ztna-profiles')
router.register(r'access-requests', AccessRequestViewSet, basename='access-requests')
router.register(r'segments', MicroSegmentViewSet, basename='micro-segments')
router.register(r'device-trust', DeviceTrustViewSet, basename='device-trust')
router.register(r'sessions', SessionMonitoringViewSet, basename='sessions')
router.register(r'jit-access', JITAccessViewSet, basename='jit-access')

urlpatterns = [
    path('', include(router.urls)),
]
