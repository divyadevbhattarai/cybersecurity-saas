from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PlaybookViewSet, PlaybookRunViewSet, SecurityAgentViewSet, WebhookViewSet

router = DefaultRouter()
router.register(r'playbooks', PlaybookViewSet, basename='playbooks')
router.register(r'runs', PlaybookRunViewSet, basename='playbook-runs')
router.register(r'agents', SecurityAgentViewSet, basename='security-agents')
router.register(r'webhooks', WebhookViewSet, basename='webhooks')

urlpatterns = [
    path('', include(router.urls)),
]
