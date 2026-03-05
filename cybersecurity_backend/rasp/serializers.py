from rest_framework import serializers
from security.serializers import BaseModelSerializer, SanitizedModelSerializer
from .models import RASPApplication, RASPEvent, RASPPolicy


class RASPEventSerializer(BaseModelSerializer):
    class Meta:
        model = RASPEvent
        fields = '__all__'


class RASPPolicySerializer(SanitizedModelSerializer):
    class Meta:
        model = RASPPolicy
        fields = '__all__'


class RASPApplicationSerializer(SanitizedModelSerializer):
    events = RASPEventSerializer(many=True, read_only=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = RASPApplication
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'api_key']
