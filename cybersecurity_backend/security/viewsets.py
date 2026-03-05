"""
Base ViewSet classes with tenant isolation.
Provides common patterns for all tenant-aware ViewSets.
"""
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .middleware import TenantContext
from .permissions import TenantPermission, RoleBasedPermission, Permission


class TenantAwareViewSet(viewsets.ModelViewSet):
    """
    Base ViewSet with automatic tenant isolation.
    
    Features:
    - Automatic tenant filtering in get_queryset
    - Automatic tenant assignment in perform_create
    - TenantPermission by default
    """
    permission_classes = [IsAuthenticated, TenantPermission]
    
    def get_queryset(self):
        tenant_id = TenantContext.get_tenant()
        queryset = getattr(self, 'queryset', None)
        if queryset is None:
            return self.model.objects.none() if hasattr(self, 'model') else None
        if tenant_id is None:
            return queryset.none()
        return queryset.filter(tenant_id=tenant_id)
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['tenant_id'] = TenantContext.get_tenant()
        return context
    
    def perform_create(self, serializer):
        tenant_id = TenantContext.get_tenant()
        serializer.save(tenant_id=tenant_id)


class TenantAwareReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only ViewSet with automatic tenant isolation.
    """
    permission_classes = [IsAuthenticated, TenantPermission]
    
    def get_queryset(self):
        tenant_id = TenantContext.get_tenant()
        queryset = getattr(self, 'queryset', None)
        if queryset is None:
            return self.model.objects.none() if hasattr(self, 'model') else None
        if tenant_id is None:
            return queryset.none()
        return queryset.filter(tenant_id=tenant_id)


class TenantAwareModelViewSet(TenantAwareViewSet):
    """
    Alias for TenantAwareViewSet for clarity.
    """
    pass
