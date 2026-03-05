from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Breach
from .serializers import BreachSerializer
from rest_framework.permissions import IsAuthenticated
from security.permissions import TenantPermission, RoleBasedPermission, Permission
from security.middleware import TenantContext
from security.viewsets import TenantAwareViewSet


class BreachViewSet(TenantAwareViewSet):
    queryset = Breach.objects.select_related('tenant').all()
    serializer_class = BreachSerializer
    permission_classes = [IsAuthenticated, TenantPermission]
