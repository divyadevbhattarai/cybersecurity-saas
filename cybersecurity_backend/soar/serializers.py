from rest_framework import serializers
from security.serializers import SanitizedModelSerializer, BaseModelSerializer
from .models import Playbook, PlaybookRun, SecurityAgent, Webhook


class PlaybookSerializer(SanitizedModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = Playbook
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'last_run', 'run_count', 'success_count', 'failure_count']


class PlaybookRunSerializer(BaseModelSerializer):
    playbook_name = serializers.CharField(source='playbook.name', read_only=True)
    triggered_by_username = serializers.CharField(source='triggered_by.username', read_only=True)
    
    class Meta:
        model = PlaybookRun
        fields = '__all__'
        read_only_fields = ['created_at']


class SecurityAgentSerializer(SanitizedModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    assigned_playbook_names = serializers.SerializerMethodField()
    
    class Meta:
        model = SecurityAgent
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'last_heartbeat']
    
    def get_assigned_playbook_names(self, obj):
        return [p.name for p in obj.assigned_playbooks.all()]


class WebhookSerializer(SanitizedModelSerializer):
    class Meta:
        model = Webhook
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
