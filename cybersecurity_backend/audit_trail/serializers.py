from rest_framework import serializers
from security.serializers import BaseModelSerializer
from .models import AuditLog


class AuditLogSerializer(BaseModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = AuditLog
        fields = '__all__'
        read_only_fields = ['timestamp', 'blockchain_hash']
