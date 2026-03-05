from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from security.viewsets import TenantAwareModelViewSet
from security.responses import success_response
from .models import SBOMProject, SBOMComponent, Vulnerability, ComponentVulnerability
from .serializers import SBOMProjectSerializer, SBOMComponentSerializer, VulnerabilitySerializer, ComponentVulnerabilitySerializer
from security.permissions import TenantPermission, RoleBasedPermission, Permission
from security.middleware import TenantContext


class SBOMProjectViewSet(TenantAwareModelViewSet):
    serializer_class = SBOMProjectSerializer
    permission_classes = (TenantPermission,)
    queryset = SBOMProject.objects.select_related('tenant', 'created_by').prefetch_related('components').all()
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['get'])
    def export_sbom(self, request, pk=None):
        project = self.get_object()
        components = project.components.all()
        sbom_data = {
            'project': SBOMProjectSerializer(project).data,
            'components': [SBOMComponentSerializer(c).data for c in components]
        }
        return success_response(data=sbom_data)


class VulnerabilityViewSet(TenantAwareModelViewSet):
    serializer_class = VulnerabilitySerializer
    permission_classes = (TenantPermission,)
    queryset = Vulnerability.objects.select_related('tenant').all()
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        cve_id = request.query_params.get('cve_id')
        if cve_id:
            return success_response(
                data=VulnerabilitySerializer(self.get_queryset().filter(cve_id__icontains=cve_id), many=True).data
            )
        return success_response(data=[])


class ComponentVulnerabilityViewSet(TenantAwareModelViewSet):
    serializer_class = ComponentVulnerabilitySerializer
    permission_classes = (TenantPermission,)
    queryset = ComponentVulnerability.objects.select_related('tenant', 'component', 'vulnerability').all()
