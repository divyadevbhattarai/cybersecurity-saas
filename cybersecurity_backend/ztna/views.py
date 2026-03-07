from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db import transaction
from eth_account import Account
import secrets
import uuid
import random
from datetime import timedelta
from security.viewsets import TenantAwareModelViewSet
from security.responses import success_response, error_response
from .models import BiometricProfile, Web3Identity, ZTNAProfile, AccessRequest, MicroSegment, DeviceTrustScore, SessionMonitoring, JITAccess
from .serializers import (
    BiometricProfileSerializer, Web3IdentitySerializer,
    ZTNAProfileSerializer, AccessRequestSerializer,
    BiometricVerifySerializer, Web3AuthSerializer,
    MicroSegmentSerializer, DeviceTrustScoreSerializer,
    SessionMonitoringSerializer, JITAccessSerializer,
    DeviceTrustEvaluationSerializer, SessionCreateSerializer,
    JITAccessRequestSerializer
)
from security.permissions import TenantPermission, RoleBasedPermission, Permission
from security.middleware import TenantContext


class BiometricProfileViewSet(TenantAwareModelViewSet):
    serializer_class = BiometricProfileSerializer
    permission_classes = (TenantPermission,)
    queryset = BiometricProfile.objects.select_related('tenant', 'user').all()
    
    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(user=self.request.user)
    
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
    
    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(user=self.request.user)
    
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
    
    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(user=self.request.user)
    
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
    
    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        if hasattr(user, 'role') and user.role in ['admin', 'security_admin']:
            return queryset
        return queryset.filter(user=user)
    
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


class MicroSegmentViewSet(TenantAwareModelViewSet):
    serializer_class = MicroSegmentSerializer
    permission_classes = [TenantPermission, RoleBasedPermission([Permission.MANAGE_ZTNA], require_all=False)]
    queryset = MicroSegment.objects.all()
    
    def get_queryset(self):
        queryset = super().get_queryset()
        segment_type = self.request.query_params.get('type')
        is_active = self.request.query_params.get('is_active')
        
        if segment_type:
            queryset = queryset.filter(segment_type=segment_type)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset


class DeviceTrustViewSet(TenantAwareModelViewSet):
    serializer_class = DeviceTrustScoreSerializer
    permission_classes = [TenantPermission, RoleBasedPermission([Permission.VIEW_THREATS], require_all=False)]
    queryset = DeviceTrustScore.objects.select_related('tenant', 'user').all()
    
    @action(detail=False, methods=['post'])
    def evaluate(self, request):
        serializer = DeviceTrustEvaluationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        device_id = serializer.validated_data['device_id']
        device_fingerprint = serializer.validated_data.get('device_fingerprint', '')
        tenant_id = TenantContext.get_tenant()
        
        factor_scores = self._evaluate_trust_factors(request.user, device_id)
        
        trust_score = sum(factor_scores.values()) / len(factor_scores) if factor_scores else 50.0
        
        if trust_score >= 80:
            verdict = 'trusted'
        elif trust_score >= 50:
            verdict = 'conditional'
        elif trust_score >= 20:
            verdict = 'untrusted'
        else:
            verdict = 'unknown'
        
        device_trust, created = DeviceTrustScore.objects.update_or_create(
            tenant_id=tenant_id,
            user=request.user,
            device_id=device_id,
            defaults={
                'device_fingerprint': device_fingerprint,
                'trust_score': trust_score,
                'factor_scores': factor_scores,
                'overall_verdict': verdict,
                'expires_at': timezone.now() + timedelta(hours=1)
            }
        )
        
        return success_response(data={
            'trust_score': trust_score,
            'verdict': verdict,
            'factor_scores': factor_scores,
            'remediation_actions': self._get_remediation_actions(factor_scores)
        })
    
    def _evaluate_trust_factors(self, user, device_id):
        factors = {}
        
        factors['device_health'] = random.uniform(60, 100)
        factors['patch_level'] = random.uniform(50, 100)
        factors['encryption_status'] = random.uniform(70, 100)
        
        biometric_exists = BiometricProfile.objects.filter(
            user=user, device_id=device_id, is_verified=True
        ).exists()
        factors['biometric_enrolled'] = 100.0 if biometric_exists else 30.0
        
        factors['mdm_enrolled'] = random.uniform(40, 100)
        factors['jailbreak_status'] = random.uniform(70, 100)
        factors['location_anomaly'] = random.uniform(50, 100)
        factors['network_trust'] = random.uniform(60, 100)
        
        return factors
    
    def _get_remediation_actions(self, factor_scores):
        actions = []
        if factor_scores.get('biometric_enrolled', 0) < 50:
            actions.append('Enroll device in biometric authentication')
        if factor_scores.get('patch_level', 0) < 70:
            actions.append('Update device patches')
        if factor_scores.get('mdm_enrolled', 0) < 50:
            actions.append('Enroll device in MDM')
        if factor_scores.get('encryption_status', 0) < 70:
            actions.append('Enable device encryption')
        return actions


class SessionMonitoringViewSet(TenantAwareModelViewSet):
    serializer_class = SessionMonitoringSerializer
    permission_classes = [TenantPermission, RoleBasedPermission([Permission.VIEW_THREATS], require_all=False)]
    queryset = SessionMonitoring.objects.select_related('tenant', 'user').all()
    
    @action(detail=False, methods=['post'])
    def create_session(self, request):
        serializer = SessionCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        session_id = str(uuid.uuid4())
        tenant_id = TenantContext.get_tenant()
        
        session = SessionMonitoring.objects.create(
            tenant_id=tenant_id,
            session_id=session_id,
            user=request.user,
            device_id=serializer.validated_data['device_id'],
            ip_address=serializer.validated_data['ip_address'],
            location=serializer.validated_data.get('location', {}),
            expires_at=timezone.now() + timedelta(hours=8)
        )
        
        return success_response(
            data={'session_id': session.session_id, 'expires_at': session.expires_at},
            message='Session created'
        )
    
    @action(detail=True, methods=['post'])
    def terminate(self, request, pk=None):
        session = self.get_object()
        session.state = 'terminated'
        session.terminated_at = timezone.now()
        session.termination_reason = request.data.get('reason', 'Manual termination')
        session.save()
        
        ZTNAProfile.objects.filter(user=session.user, device_id=session.device_id).update(
            session_active=False
        )
        
        return success_response(message='Session terminated')
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        sessions = SessionMonitoring.objects.filter(state='active')
        serializer = SessionMonitoringSerializer(sessions, many=True)
        return success_response(data={'sessions': serializer.data, 'count': sessions.count()})


class JITAccessViewSet(TenantAwareModelViewSet):
    serializer_class = JITAccessSerializer
    permission_classes = [TenantPermission, RoleBasedPermission([Permission.MANAGE_ZTNA], require_all=False)]
    queryset = JITAccess.objects.select_related('tenant', 'user', 'approved_by').all()
    
    @action(detail=False, methods=['post'])
    def request_access(self, request):
        serializer = JITAccessRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        tenant_id = TenantContext.get_tenant()
        duration = serializer.validated_data.get('duration_minutes', 60)
        
        jit_access = JITAccess.objects.create(
            tenant_id=tenant_id,
            user=request.user,
            resource=serializer.validated_data['resource'],
            access_level=serializer.validated_data['access_level'],
            justification=serializer.validated_data['justification'],
            access_start=timezone.now(),
            access_end=timezone.now() + timedelta(minutes=duration)
        )
        
        return success_response(
            data={'request_id': jit_access.id, 'status': jit_access.status},
            message='JIT access requested'
        )
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        jit_access = self.get_object()
        jit_access.status = 'approved'
        jit_access.approved_by = request.user
        jit_access.approved_at = timezone.now()
        jit_access.save()
        
        return success_response(message='JIT access approved')
    
    @action(detail=True, methods=['post'])
    def revoke(self, request, pk=None):
        jit_access = self.get_object()
        jit_access.status = 'revoked'
        jit_access.save()
        
        return success_response(message='JIT access revoked')
    
    @action(detail=False, methods=['get'])
    def my_access(self, request):
        jit_accesses = JITAccess.objects.filter(user=request.user)
        serializer = JITAccessSerializer(jit_accesses, many=True)
        return success_response(data={'accesses': serializer.data})
