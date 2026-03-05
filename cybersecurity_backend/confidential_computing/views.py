from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from security.viewsets import TenantAwareModelViewSet
from security.responses import success_response, error_response
from .models import Enclave, SecureSession
from .serializers import EnclaveSerializer, SecureSessionSerializer
from security.permissions import TenantPermission, RoleBasedPermission, Permission
from security.middleware import TenantContext


class EnclaveViewSet(TenantAwareModelViewSet):
    serializer_class = EnclaveSerializer
    permission_classes = (TenantPermission,)
    queryset = Enclave.objects.select_related('tenant').all()
    
    @action(detail=True, methods=['post'])
    def initialize(self, request, pk=None):
        enclave = self.get_object()
        enclave.status = 'initializing'
        enclave.attestation_data = {
            'measurement': 'TODO: retrieve_from_hardware',
            'family_id': 'TODO: retrieve_from_hardware',
            'svn': 1,
            'note': 'Attestation not implemented - requires TEE hardware integration'
        }
        enclave.save()
        return success_response(message='Enclave initializing')

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        enclave = self.get_object()
        enclave.status = 'active'
        enclave.save()
        return success_response(message='Enclave activated')

    @action(detail=True, methods=['post'])
    def terminate(self, request, pk=None):
        enclave = self.get_object()
        enclave.status = 'terminated'
        enclave.save()
        return success_response(message='Enclave terminated')

    @action(detail=False, methods=['get'])
    def active(self, request):
        active_enclaves = self.get_queryset().filter(status='active')
        serializer = self.get_serializer(active_enclaves, many=True)
        return success_response(data=serializer.data)


class SecureSessionViewSet(TenantAwareModelViewSet):
    serializer_class = SecureSessionSerializer
    permission_classes = (TenantPermission,)
    queryset = SecureSession.objects.select_related('tenant', 'enclave').all()

    @action(detail=True, methods=['post'])
    def extend(self, request, pk=None):
        session = self.get_object()
        hours = request.data.get('hours', 1)
        try:
            hours = int(hours)
        except (TypeError, ValueError):
            return error_response('hours must be an integer', 'VALIDATION_ERROR', status.HTTP_400_BAD_REQUEST)
        if hours < 1 or hours > 24:
            return error_response('hours must be between 1 and 24', 'VALIDATION_ERROR', status.HTTP_400_BAD_REQUEST)
        if session.expires_at:
            session.expires_at = session.expires_at + timezone.timedelta(hours=hours)
        else:
            session.expires_at = timezone.now() + timezone.timedelta(hours=hours)
        session.save()
        return success_response(data={'expires_at': session.expires_at}, message='Session extended')

    @action(detail=True, methods=['post'])
    def terminate_session(self, request, pk=None):
        session = self.get_object()
        session.expires_at = timezone.now()
        session.save()
        return success_response(message='Session terminated')
