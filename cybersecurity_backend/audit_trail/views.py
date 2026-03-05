from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
import hashlib
import json
from security.viewsets import TenantAwareModelViewSet
from security.responses import success_response
from .models import AuditLog
from .serializers import AuditLogSerializer
from security.permissions import TenantPermission, RoleBasedPermission, Permission
from security.middleware import TenantContext


class AuditLogViewSet(TenantAwareModelViewSet):
    serializer_class = AuditLogSerializer
    permission_classes = (TenantPermission,)
    queryset = AuditLog.objects.select_related('tenant', 'user').all()

    @action(detail=False, methods=['post'])
    def log_action(self, request):
        action_type = request.data.get('action', 'custom')
        resource = request.data.get('resource', '')
        tenant_id = TenantContext.get_tenant()
        
        log_entry = AuditLog.objects.create(
            tenant_id=tenant_id,
            user=request.user,
            action=action_type,
            resource=resource,
            ip_address=self._get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', ''),
            metadata=request.data.get('metadata', {})
        )
        
        hash_data = f"{log_entry.id}{log_entry.timestamp.isoformat()}{action_type}{resource}"
        log_entry.blockchain_hash = hashlib.sha256(hash_data.encode()).hexdigest()
        log_entry.save()
        
        return success_response(data=AuditLogSerializer(log_entry).data, message='Audit log created', status_code=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def recent(self, request):
        page_size = int(request.query_params.get('page_size', 20))
        recent_logs = self.get_queryset()[:page_size]
        serializer = self.get_serializer(recent_logs, many=True)
        return success_response(data=serializer.data)

    @action(detail=False, methods=['get'])
    def by_resource(self, request):
        resource = request.query_params.get('resource')
        logs = self.get_queryset().filter(resource=resource)
        serializer = self.get_serializer(logs, many=True)
        return success_response(data=serializer.data)

    def _get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
