from rest_framework import serializers
from security.serializers import SanitizedModelSerializer, BaseModelSerializer
from .models import SBOMProject, SBOMComponent, Vulnerability, ComponentVulnerability


class SBOMComponentSerializer(SanitizedModelSerializer):
    class Meta:
        model = SBOMComponent
        fields = ['id', 'project', 'name', 'version', 'package_type', 'supplier', 'license', 'description', 'purl', 'cpe', 'is_direct_dependency', 'created_at']


class SBOMProjectSerializer(SanitizedModelSerializer):
    components = SBOMComponentSerializer(many=True, read_only=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = SBOMProject
        fields = ['id', 'name', 'description', 'version', 'repository_url', 'created_by', 'created_by_username', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at', 'created_by']


class VulnerabilitySerializer(SanitizedModelSerializer):
    class Meta:
        model = Vulnerability
        fields = ['id', 'cve_id', 'title', 'description', 'severity', 'cvss_score', 'affected_versions', 'fixed_versions', 'references', 'published_date', 'created_at']


class ComponentVulnerabilitySerializer(BaseModelSerializer):
    component_name = serializers.CharField(source='component.name', read_only=True)
    cve_id = serializers.CharField(source='vulnerability.cve_id', read_only=True)
    severity = serializers.CharField(source='vulnerability.severity', read_only=True)
    
    class Meta:
        model = ComponentVulnerability
        fields = ['id', 'component', 'component_name', 'vulnerability', 'cve_id', 'severity', 'status', 'remediation_status', 'notes', 'detected_at']
