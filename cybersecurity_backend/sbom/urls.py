from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SBOMProjectViewSet, VulnerabilityViewSet, ComponentVulnerabilityViewSet

router = DefaultRouter()
router.register(r'projects', SBOMProjectViewSet, basename='sbom-projects')
router.register(r'vulnerabilities', VulnerabilityViewSet, basename='vulnerabilities')
router.register(r'component-vulnerabilities', ComponentVulnerabilityViewSet, basename='component-vulnerabilities')

urlpatterns = [
    path('', include(router.urls)),
]
