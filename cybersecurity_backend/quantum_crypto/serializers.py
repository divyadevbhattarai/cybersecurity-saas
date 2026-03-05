from rest_framework import serializers
from security.serializers import SanitizedModelSerializer, BaseModelSerializer
from .models import EncryptionKey, KeyRotation


class EncryptionKeySerializer(SanitizedModelSerializer):
    class Meta:
        model = EncryptionKey
        fields = ['id', 'name', 'algorithm', 'is_active', 'expires_at', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
        extra_kwargs = {
            'expires_at': {'required': False},
        }


class EncryptionKeyCreateSerializer(SanitizedModelSerializer):
    class Meta:
        model = EncryptionKey
        fields = ['name', 'algorithm', 'key_data', 'expires_at']


class KeyRotationSerializer(BaseModelSerializer):
    key_name = serializers.CharField(source='key.name', read_only=True)
    rotated_by_username = serializers.CharField(source='rotated_by.username', read_only=True)

    class Meta:
        model = KeyRotation
        fields = ['id', 'key', 'key_name', 'old_key', 'rotated_at', 'rotated_by', 'rotated_by_username']
        read_only_fields = ['rotated_at']
