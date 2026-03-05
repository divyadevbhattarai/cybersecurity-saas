from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
import secrets
from security.viewsets import TenantAwareModelViewSet
from security.responses import success_response, error_response
from .models import Honeypot, CanaryToken, ThreatHunt
from .serializers import HoneypotSerializer, CanaryTokenSerializer, ThreatHuntSerializer
from security.permissions import TenantPermission, RoleBasedPermission, Permission
from security.middleware import TenantContext


class HoneypotViewSet(TenantAwareModelViewSet):
    serializer_class = HoneypotSerializer
    permission_classes = (TenantPermission,)
    queryset = Honeypot.objects.select_related('tenant').all()
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        honeypot = self.get_object()
        honeypot.is_active = True
        honeypot.save()
        return success_response(message='Honeypot activated')

    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        honeypot = self.get_object()
        honeypot.is_active = False
        honeypot.save()
        return success_response(message='Honeypot deactivated')

    @action(detail=False, methods=['get'])
    def active(self, request):
        active_honeypots = self.get_queryset().filter(is_active=True)
        serializer = self.get_serializer(active_honeypots, many=True)
        return success_response(data=serializer.data)


class CanaryTokenViewSet(TenantAwareModelViewSet):
    serializer_class = CanaryTokenSerializer
    permission_classes = (TenantPermission,)
    queryset = CanaryToken.objects.select_related('tenant').all()
    
    @action(detail=False, methods=['post'])
    def generate(self, request):
        token_type = request.data.get('type', 'url')
        token = secrets.token_urlsafe(32)
        tenant_id = TenantContext.get_tenant()
        canary = CanaryToken.objects.create(
            tenant_id=tenant_id,
            token=token,
            type=token_type,
            target=request.data.get('target', '')
        )
        return success_response(data=CanaryTokenSerializer(canary).data, message='Canary token created', status_code=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def trigger(self, request, pk=None):
        canary = self.get_object()
        canary.triggered_at = timezone.now()
        canary.is_active = False
        canary.save()
        return success_response(data={'triggered_at': canary.triggered_at}, message='Canary token triggered')

    @action(detail=False, methods=['get'])
    def triggered(self, request):
        triggered_tokens = self.get_queryset().filter(triggered_at__isnull=False)
        serializer = self.get_serializer(triggered_tokens, many=True)
        return success_response(data=serializer.data)


class ThreatHuntViewSet(TenantAwareModelViewSet):
    serializer_class = ThreatHuntSerializer
    permission_classes = (TenantPermission,)
    queryset = ThreatHunt.objects.select_related('tenant').all()
    
    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        hunt = self.get_object()
        hunt.status = 'in_progress'
        hunt.save()
        return success_response(message='Threat hunt started')

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        hunt = self.get_object()
        ioc_data = request.data.get('ioc_data')
        if ioc_data is not None:
            if not isinstance(ioc_data, (dict, list)):
                return error_response('ioc_data must be a dict or list', 'VALIDATION_ERROR', status.HTTP_400_BAD_REQUEST)
            if isinstance(ioc_data, dict):
                for key, value in ioc_data.items():
                    if not isinstance(key, str):
                        return error_response('ioc_data keys must be strings', 'VALIDATION_ERROR', status.HTTP_400_BAD_REQUEST)
            hunt.ioc_data = ioc_data
        hunt.status = 'completed'
        hunt.save()
        return success_response(message='Threat hunt completed')

    @action(detail=False, methods=['get'])
    def pending(self, request):
        pending_hunts = self.get_queryset().filter(status='pending')
        serializer = self.get_serializer(pending_hunts, many=True)
        return success_response(data=serializer.data)
