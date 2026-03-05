from rest_framework import serializers
from security.serializers import SanitizedModelSerializer, BaseModelSerializer
from .models import Honeypot, CanaryToken, ThreatHunt


class HoneypotSerializer(SanitizedModelSerializer):
    class Meta:
        model = Honeypot
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class CanaryTokenSerializer(SanitizedModelSerializer):
    class Meta:
        model = CanaryToken
        fields = '__all__'
        read_only_fields = ['triggered_at', 'created_at']


class ThreatHuntSerializer(SanitizedModelSerializer):
    class Meta:
        model = ThreatHunt
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
