from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db import transaction
from eth_account import Account
import hashlib
import secrets
from .models import BiometricProfile, Web3Identity, ZTNAProfile, AccessRequest
from .serializers import (
    BiometricProfileSerializer, Web3IdentitySerializer,
    ZTNAProfileSerializer, AccessRequestSerializer,
    BiometricVerifySerializer, Web3AuthSerializer
)


class BiometricProfileViewSet(viewsets.ModelViewSet):
    queryset = BiometricProfile.objects.all()
    serializer_class = BiometricProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def verify(self, request):
        serializer = BiometricVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        device_id = serializer.validated_data['device_id']
        
        try:
            profile = BiometricProfile.objects.get(
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
                return Response({
                    'verified': True,
                    'similarity': similarity,
                    'message': 'Biometric verification successful'
                })
            
            return Response({
                'verified': False,
                'similarity': similarity,
                'message': 'Biometric verification failed'
            })
        except BiometricProfile.DoesNotExist:
            return Response({
                'verified': False,
                'message': 'Device not registered'
            }, status=status.HTTP_404_NOT_FOUND)
    
    def _calculate_similarity(self, input_pattern, stored_pattern):
        if not stored_pattern:
            return 0.0
        matching_keys = sum(1 for k in input_pattern if k in stored_pattern)
        return matching_keys / max(len(stored_pattern), 1)


class Web3IdentityViewSet(viewsets.ModelViewSet):
    queryset = Web3Identity.objects.all()
    serializer_class = Web3IdentitySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def generate_nonce(self, request):
        nonce = secrets.token_hex(32)
        wallet_address = request.data.get('wallet_address')
        
        identity, created = Web3Identity.objects.get_or_create(
            user=request.user,
            defaults={'wallet_address': wallet_address, 'nonce': nonce}
        )
        
        if not created:
            identity.nonce = nonce
            identity.save()
        
        message = f"Sign this message to authenticate. Nonce: {nonce}"
        
        return Response({
            'nonce': nonce,
            'message': message
        })
    
    @action(detail=False, methods=['post'])
    def verify_signature(self, request):
        serializer = Web3AuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        wallet_address = serializer.validated_data['wallet_address']
        signature = serializer.validated_data['signature']
        message = serializer.validated_data['message']
        
        try:
            identity = Web3Identity.objects.get(wallet_address=wallet_address, user=request.user)
            
            try:
                recovered = Account.from_message(message)
                if recovered.address.lower() == wallet_address.lower():
                    identity.is_verified = True
                    identity.signature = signature
                    identity.save()
                    return Response({
                        'verified': True,
                        'message': 'Web3 identity verified'
                    })
            except Exception as e:
                pass
            
            return Response({
                'verified': False,
                'message': 'Signature verification failed'
            })
        except Web3Identity.DoesNotExist:
            return Response({
                'verified': False,
                'message': 'Web3 identity not found'
            }, status=status.HTTP_404_NOT_FOUND)


class ZTNAProfileViewSet(viewsets.ModelViewSet):
    queryset = ZTNAProfile.objects.all()
    serializer_class = ZTNAProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def assess_trust(self, request):
        with transaction.atomic():
            device_id = request.data.get('device_id')
            ip_address = request.data.get('ip_address')
            device_fingerprint = request.data.get('device_fingerprint')
            
            trust_score = 50.0
            risk_factors = []
            
            biometric_exists = BiometricProfile.objects.filter(
                user=request.user, device_id=device_id, is_verified=True
            ).exists()
            
            if biometric_exists:
                trust_score += 30
            else:
                risk_factors.append('Unverified device')
            
            profile, created = ZTNAProfile.objects.select_for_update().get_or_create(
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
            
            return Response({
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
        return Response({'message': 'Session revoked successfully'})


class AccessRequestViewSet(viewsets.ModelViewSet):
    queryset = AccessRequest.objects.all()
    serializer_class = AccessRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        access_request = self.get_object()
        access_request.status = 'approved'
        access_request.approved_by = request.user
        access_request.approved_at = timezone.now()
        access_request.expires_at = timezone.now() + timezone.timedelta(hours=request.data.get('duration', 24))
        access_request.save()
        return Response({'message': 'Access request approved'})
    
    @action(detail=True, methods=['post'])
    def deny(self, request, pk=None):
        access_request = self.get_object()
        access_request.status = 'denied'
        access_request.approved_by = request.user
        access_request.approved_at = timezone.now()
        access_request.save()
        return Response({'message': 'Access request denied'})
