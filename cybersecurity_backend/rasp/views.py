from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
import secrets
from security.viewsets import TenantAwareModelViewSet
from security.responses import success_response
from .models import RASPApplication, RASPEvent, RASPPolicy
from .serializers import RASPApplicationSerializer, RASPEventSerializer, RASPPolicySerializer
from security.permissions import TenantPermission, RoleBasedPermission, Permission
from security.middleware import TenantContext


class RASPApplicationViewSet(TenantAwareModelViewSet):
    serializer_class = RASPApplicationSerializer
    permission_classes = (TenantPermission,)
    queryset = RASPApplication.objects.select_related('tenant', 'created_by').all()
    
    def perform_create(self, serializer):
        api_key = secrets.token_urlsafe(32)
        serializer.save(created_by=self.request.user, api_key=api_key)
    
    @action(detail=True, methods=['post'])
    def regenerate_api_key(self, request, pk=None):
        app = self.get_object()
        app.api_key = secrets.token_urlsafe(32)
        app.save()
        return success_response(message='API key regenerated successfully')


class RASPEventViewSet(TenantAwareModelViewSet):
    serializer_class = RASPEventSerializer
    permission_classes = (TenantPermission,)
    queryset = RASPEvent.objects.select_related('tenant', 'application').all()
    
    @action(detail=False, methods=['get'])
    def attacks(self, request):
        events = self.get_queryset()
        serializer = self.get_serializer(events, many=True)
        return success_response(data=serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        events = self.get_queryset()
        return success_response(data={
            'total': events.count(),
            'blocked': events.filter(blocked=True).count(),
            'by_severity': {
                'critical': events.filter(severity='critical').count(),
                'high': events.filter(severity='high').count(),
                'medium': events.filter(severity='medium').count(),
                'low': events.filter(severity='low').count(),
            }
        })


class RASPPolicyViewSet(TenantAwareModelViewSet):
    serializer_class = RASPPolicySerializer
    permission_classes = (TenantPermission,)
    queryset = RASPPolicy.objects.select_related('tenant').all()
