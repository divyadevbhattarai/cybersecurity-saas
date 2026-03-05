"""
Base serializer classes with common functionality.
Provides tenant awareness and input sanitization.
"""
from rest_framework import serializers
from .validators import InputSanitizer, SanitizedSerializerMixin


class TenantAwareSerializerMixin:
    """
    Mixin to add tenant context to serializers.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        tenant_id = self.context.get('tenant_id') if self.context else None
        self.tenant_id = tenant_id


class BaseModelSerializer(TenantAwareSerializerMixin, serializers.ModelSerializer):
    """
    Base ModelSerializer with tenant awareness.
    """
    pass


class SanitizedModelSerializer(SanitizedSerializerMixin, BaseModelSerializer):
    """
    ModelSerializer with automatic input sanitization.
    Use this for serializers that accept user input.
    """
    pass


class ReadOnlySerializerMixin:
    """
    Mixin for read-only fields that don't need sanitization.
    """
    pass
