from rest_framework import serializers
from security.serializers import SanitizedModelSerializer, BaseModelSerializer
from .models import Playbook, PlaybookRun, SecurityAgent, Webhook


class PlaybookSerializer(SanitizedModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = Playbook
        fields = ['id', 'name', 'description', 'trigger_type', 'trigger_conditions', 
                  'actions', 'conditions', 'status', 'priority', 'estimated_duration',
                  'created_by_username', 'last_run', 'run_count', 'success_count', 
                  'failure_count', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at', 'last_run', 'run_count', 
                           'success_count', 'failure_count', 'created_by']
        extra_kwargs = {
            'description': {'required': False},
            'trigger_type': {'required': False},
            'estimated_duration': {'required': False},
            'status': {'required': False},
        }
    
    def validate(self, attrs):
        if 'trigger' in self.initial_data:
            attrs['trigger_type'] = self.initial_data.get('trigger', self.initial_data.get('trigger_type', 'manual'))
        if 'active' in self.initial_data:
            status_val = 'active' if self.initial_data.get('active') else 'draft'
            attrs['status'] = self.initial_data.get('status', status_val)
        if 'created_by' not in attrs:
            attrs['created_by'] = self.context['request'].user
        if 'description' not in attrs or not attrs['description']:
            attrs['description'] = attrs.get('description', '')
        if 'estimated_duration' not in attrs or not attrs.get('estimated_duration'):
            attrs['estimated_duration'] = 30
        if 'trigger_type' not in attrs or not attrs.get('trigger_type'):
            attrs['trigger_type'] = 'manual'
        if 'status' not in attrs or not attrs.get('status'):
            attrs['status'] = 'draft'
        return attrs


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
    active = serializers.BooleanField(required=False, write_only=True)
    
    class Meta:
        model = Webhook
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
    
    def to_internal_value(self, data):
        ret = super().to_internal_value(data)
        if 'active' in data:
            ret['is_active'] = data.get('active', True)
        if 'events' in data and isinstance(data.get('events'), str):
            ret['events'] = [e.strip() for e in data.get('events', '').split(',') if e.strip()]
        return ret
