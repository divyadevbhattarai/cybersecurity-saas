from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db import transaction
from eth_account import Account
import secrets
from security.viewsets import TenantAwareModelViewSet
from security.responses import success_response, error_response
from .models import BiometricProfile, Web3Identity, ZTNAProfile, AccessRequest
from .serializers import (
    BiometricProfileSerializer, Web3IdentitySerializer,
    ZTNAProfileSerializer, AccessRequestSerializer,
    BiometricVerifySerializer, Web3AuthSerializer
)
from security.permissions import TenantPermission, RoleBasedPermission, Permission
from security.middleware import TenantContext


class BiometricProfileViewSet(TenantAwareModelViewSet):
    serializer_class = BiometricProfileSerializer
    permission_classes = (TenantPermission,)
    queryset = BiometricProfile.objects.select_related('tenant', 'user').all()
    
    @action(detail=False, methods=['post'])
    def verify(self, request):
        serializer = BiometricVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        device_id = serializer.validated_data['device_id']
        tenant_id = TenantContext.get_tenant()
        
        try:
            profile = BiometricProfile.objects.get(
                tenant_id=tenant_id,
                user=request.user,
                device_id=device_id
            )
            
            input_pattern = serializer.validated_data.get('keystroke_pattern', {})
            stored_pattern = profile.keystroke_pattern
            
            similarity = self._calculate_similarity(input_pattern, stored_pattern)
            
            if similarity > 0.85:
                profile.is_verified = True
                profile.last_verified = timezone.now()
                profile.save()
                return success_response(
                    data={'verified': True, 'similarity': similarity},
                    message='Biometric verification successful'
                )
            
            return success_response(
                data={'verified': False, 'similarity': similarity},
                message='Biometric verification failed'
            )
        except BiometricProfile.DoesNotExist:
            return error_response('Device not registered', 'NOT_FOUND', status.HTTP_404_NOT_FOUND)
    
    def _calculate_similarity(self, input_pattern, stored_pattern):
        if not stored_pattern:
            return 0.0
        matching_keys = sum(1 for k in input_pattern if k in stored_pattern)
        return matching_keys / max(len(stored_pattern), 1)


class Web3IdentityViewSet(TenantAwareModelViewSet):
    serializer_class = Web3IdentitySerializer
    permission_classes = (TenantPermission,)
    queryset = Web3Identity.objects.select_related('tenant', 'user').all()
    
    @action(detail=False, methods=['post'])
    def generate_nonce(self, request):
        nonce = secrets.token_hex(32)
        wallet_address = request.data.get('wallet_address')
        tenant_id = TenantContext.get_tenant()
        
        identity, created = Web3Identity.objects.get_or_create(
            tenant_id=tenant_id,
            user=request.user,
            defaults={'wallet_address': wallet_address, 'nonce': nonce}
        )
        
        if not created:
            identity.nonce = nonce
            identity.save()
        
        message = f"Sign this message to authenticate. Nonce: {nonce}"
        
        return success_response(
            data={'nonce': nonce, 'message': message}
        )
    
    @action(detail=False, methods=['post'])
    def verify_signature(self, request):
        serializer = Web3AuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        wallet_address = serializer.validated_data['wallet_address']
        signature = serializer.validated_data['signature']
        message = serializer.validated_data['message']
        tenant_id = TenantContext.get_tenant()
        
        try:
            identity = Web3Identity.objects.get(tenant_id=tenant_id, wallet_address=wallet_address, user=request.user)
            
            try:
                recovered = Account.from_message(message)
                if recovered.address.lower() == wallet_address.lower():
                    identity.is_verified = True
                    identity.signature = signature
                    identity.save()
                    return success_response(
                        data={'verified': True},
                        message='Web3 identity verified'
                    )
            except Exception as e:
                pass
            
            return success_response(
                data={'verified': False},
                message='Signature verification failed'
            )
        except Web3Identity.DoesNotExist:
            return error_response('Web3 identity not found', 'NOT_FOUND', status.HTTP_404_NOT_FOUND)


class ZTNAProfileViewSet(TenantAwareModelViewSet):
    serializer_class = ZTNAProfileSerializer
    permission_classes = (TenantPermission,)
    queryset = ZTNAProfile.objects.select_related('tenant', 'user').all()
    
    @action(detail=False, methods=['post'])
    def assess_trust(self, request):
        with transaction.atomic():
            device_id = request.data.get('device_id')
            ip_address = request.data.get('ip_address')
            device_fingerprint = request.data.get('device_fingerprint')
            tenant_id = TenantContext.get_tenant()
            
            trust_score = 50.0
            risk_factors = []
            
            biometric_exists = BiometricProfile.objects.filter(
                tenant_id=tenant_id,
                user=request.user, device_id=device_id, is_verified=True
            ).exists()
            
            if biometric_exists:
                trust_score += 30
            else:
                risk_factors.append('Unverified device')
            
            profile, created = ZTNAProfile.objects.select_for_update().get_or_create(
                tenant_id=tenant_id,
                user=request.user,
                device_id=device_id,
                defaults={
                    'ip_address': ip_address,
                    'device_fingerprint': device_fingerprint,
                    'trust_score': trust_score,
                    'is_trusted': trust_score >= 70,
                    'session_active': True,
                    'session_expires_at': timezone.now() + timezone.timedelta(hours=8)
                }
            )
            
            if not created:
                profile.trust_score = trust_score
                profile.is_trusted = trust_score >= 70
                profile.last_access = timezone.now()
                profile.session_active = True
                profile.save()
            
            if trust_score >= 70:
                access_level = 'high'
            elif trust_score >= 50:
                access_level = 'medium'
            else:
                access_level = 'low'
            
            return success_response(data={
                'trust_score': trust_score,
                'is_trusted': trust_score >= 70,
                'access_level': access_level,
                'risk_factors': risk_factors,
                'jit_access': True
            })
    
    @action(detail=True, methods=['post'])
    def revoke_session(self, request, pk=None):
        profile = self.get_object()
        profile.session_active = False
        profile.save()
        return success_response(message='Session revoked successfully')


class AccessRequestViewSet(TenantAwareModelViewSet):
    serializer_class = AccessRequestSerializer
    permission_classes = (TenantPermission,)
    queryset = AccessRequest.objects.select_related('tenant', 'user', 'approved_by').all()
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        access_request = self.get_object()
        access_request.status = 'approved'
        access_request.approved_by = request.user
        access_request.approved_at = timezone.now()
        access_request.expires_at = timezone.now() + timezone.timedelta(hours=request.data.get('duration', 24))
        access_request.save()
        return success_response(message='Access request approved')
    
    @action(detail=True, methods=['post'])
    def deny(self, request, pk=None):
        access_request = self.get_object()
        access_request.status = 'denied'
        access_request.approved_by = request.user
        access_request.approved_at = timezone.now()
        access_request.save()
        return success_response(message='Access request denied')
