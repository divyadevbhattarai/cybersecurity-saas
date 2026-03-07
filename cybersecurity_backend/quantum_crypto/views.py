from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
import secrets
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend
from drf_spectacular.utils import extend_schema, extend_schema_view
from security.viewsets import TenantAwareModelViewSet
from security.responses import success_response
from .models import EncryptionKey, KeyRotation
from .serializers import EncryptionKeySerializer, EncryptionKeyCreateSerializer, KeyRotationSerializer
from security.permissions import TenantPermission, RoleBasedPermission, Permission
from security.middleware import TenantContext


class EncryptionKeyViewSet(TenantAwareModelViewSet):
    serializer_class = EncryptionKeySerializer
    permission_classes = (TenantPermission,)
    queryset = EncryptionKey.objects.select_related('tenant').all()

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(tenant=TenantContext.get_tenant())

    def get_serializer_class(self):
        if self.action == 'create':
            return EncryptionKeyCreateSerializer
        return EncryptionKeySerializer
    
    @action(detail=False, methods=['get'])
    def keys(self, request):
        keys = self.get_queryset()
        serializer = self.get_serializer(keys, many=True)
        return success_response(data=serializer.data)
    
    @action(detail=False, methods=['get'])
    def algorithms(self, request):
        return success_response(data=[
            {'id': 'aes256', 'name': 'AES-256', 'type': 'symmetric'},
            {'id': 'rsa2048', 'name': 'RSA-2048', 'type': 'asymmetric'},
            {'id': 'rsa4096', 'name': 'RSA-4096', 'type': 'asymmetric'},
            {'id': 'post-quantum', 'name': 'Post-Quantum Kyber', 'type': 'post-quantum'},
        ])

    @action(detail=False, methods=['post'])
    def generate(self, request):
        algorithm = request.data.get('algorithm', 'aes256')
        name = request.data.get('name', f'Key-{timezone.now().isoformat()}')
        
        key_data = secrets.token_bytes(32).hex()
        
        if algorithm.startswith('rsa'):
            private_key = rsa.generate_private_key(
                public_exponent=65537,
                key_size=int(algorithm.replace('rsa', '')),
                backend=default_backend()
            )
            key_data = private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption()
            ).decode('utf-8')
        
        expires_at = request.data.get('expires_at')
        if expires_at:
            expires_at = timezone.datetime.fromisoformat(expires_at)
        
        tenant_id = TenantContext.get_tenant()
        key = EncryptionKey.objects.create(
            tenant_id=tenant_id,
            name=name,
            algorithm=algorithm,
            key_data=key_data,
            expires_at=expires_at
        )
        
        return success_response(data=EncryptionKeySerializer(key).data, message='Key created', status_code=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def rotate(self, request, pk=None):
        key = self.get_object()
        old_key = key
        
        new_key_data = secrets.token_bytes(32).hex()
        tenant_id = TenantContext.get_tenant()
        new_key = EncryptionKey.objects.create(
            tenant_id=tenant_id,
            name=f"{key.name}-rotated",
            algorithm=key.algorithm,
            key_data=new_key_data,
            expires_at=key.expires_at
        )
        
        KeyRotation.objects.create(
            tenant_id=tenant_id,
            key=new_key,
            old_key=old_key,
            rotated_by=request.user
        )
        
        old_key.is_active = False
        old_key.save()
        
        return success_response(data={'new_key_id': new_key.id}, message='Key rotated successfully')

    @action(detail=False, methods=['get'])
    def active(self, request):
        active_keys = self.get_queryset().filter(is_active=True)
        serializer = self.get_serializer(active_keys, many=True)
        return success_response(data=serializer.data)


@extend_schema_view(
    list=extend_schema(exclude=True),
    retrieve=extend_schema(exclude=True),
    create=extend_schema(exclude=True),
    update=extend_schema(exclude=True),
    partial_update=extend_schema(exclude=True),
    destroy=extend_schema(exclude=True),
)
class KeyRotationViewSet(TenantAwareModelViewSet):
    serializer_class = KeyRotationSerializer
    permission_classes = (TenantPermission,)
    queryset = KeyRotation.objects.select_related('tenant', 'key', 'old_key', 'rotated_by').all()
    
    @action(detail=False, methods=['get'])
    def rotation_history(self, request):
        rotations = self.get_queryset()
        serializer = self.get_serializer(rotations, many=True)
        return success_response(data=serializer.data)
