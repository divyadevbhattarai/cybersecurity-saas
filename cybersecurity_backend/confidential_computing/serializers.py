from rest_framework import serializers
from security.serializers import SanitizedModelSerializer, BaseModelSerializer
from .models import Enclave, SecureSession


class EnclaveSerializer(SanitizedModelSerializer):
    class Meta:
        model = Enclave
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class SecureSessionSerializer(BaseModelSerializer):
    enclave_name = serializers.CharField(source='enclave.name', read_only=True)

    class Meta:
        model = SecureSession
        fields = '__all__'
        read_only_fields = ['session_id', 'started_at']
