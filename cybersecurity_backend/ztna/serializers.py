from rest_framework import serializers
from security.serializers import SanitizedModelSerializer, BaseModelSerializer
from .models import BiometricProfile, Web3Identity, ZTNAProfile, AccessRequest, MicroSegment, DeviceTrustScore, SessionMonitoring, JITAccess
import uuid


class BiometricProfileSerializer(BaseModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = BiometricProfile
        fields = ['id', 'username', 'device_id', 'device_type', 'keystroke_pattern', 
                  'mouse_movement_pattern', 'touch_pattern', 'voice_pattern',
                  'behavioral_score', 'is_verified', 'last_verified', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at', 'behavioral_score', 'is_verified']
        extra_kwargs = {
            'device_id': {'required': False, 'allow_blank': True},
            'device_type': {'required': False},
        }

    def validate(self, attrs):
        if 'device_type' in self.initial_data:
            attrs['device_type'] = self.initial_data.get('biometric_type', self.initial_data.get('device_type', 'laptop'))
        if 'name' in self.initial_data:
            attrs['device_id'] = self.initial_data.get('name', self.initial_data.get('device_id', ''))
        if 'user' not in attrs:
            attrs['user'] = self.context['request'].user
        if 'device_type' not in attrs or not attrs['device_type']:
            attrs['device_type'] = 'laptop'
        if 'device_id' not in attrs or not attrs['device_id']:
            attrs['device_id'] = 'device-' + str(uuid.uuid4())[:8]
        return attrs


class Web3IdentitySerializer(BaseModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Web3Identity
        fields = '__all__'
        read_only_fields = ['did', 'is_verified', 'created_at', 'updated_at']


class ZTNAProfileSerializer(BaseModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = ZTNAProfile
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'trust_score', 'is_trusted']


class AccessRequestSerializer(SanitizedModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    approved_by_username = serializers.CharField(source='approved_by.username', read_only=True)
    duration = serializers.IntegerField(required=False, write_only=True)
    access_level = serializers.CharField(required=False, default='read')
    
    class Meta:
        model = AccessRequest
        fields = '__all__'
        read_only_fields = ['approved_by', 'approved_at', 'created_at', 'user']
    
    def create(self, validated_data):
        duration = validated_data.pop('duration', None)
        if 'access_level' not in validated_data:
            validated_data['access_level'] = 'read'
        validated_data['user'] = self.context['request'].user
        instance = super().create(validated_data)
        if duration:
            from django.utils import timezone
            from datetime import timedelta
            instance.expires_at = timezone.now() + timedelta(minutes=duration)
            instance.save()
        return instance


class MicroSegmentSerializer(SanitizedModelSerializer):
    class Meta:
        model = MicroSegment
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class DeviceTrustScoreSerializer(SanitizedModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = DeviceTrustScore
        fields = '__all__'
        read_only_fields = ['last_evaluated']


class SessionMonitoringSerializer(SanitizedModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = SessionMonitoring
        fields = '__all__'
        read_only_fields = ['started_at', 'last_activity']


class JITAccessSerializer(SanitizedModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    approved_by_username = serializers.CharField(source='approved_by.username', read_only=True)
    
    class Meta:
        model = JITAccess
        fields = '__all__'
        read_only_fields = ['approved_by', 'approved_at', 'created_at']


class BiometricVerifySerializer(serializers.Serializer):
    device_id = serializers.CharField()
    keystroke_pattern = serializers.JSONField(required=False)
    mouse_movement_pattern = serializers.JSONField(required=False)
    touch_pattern = serializers.JSONField(required=False)


class Web3AuthSerializer(serializers.Serializer):
    wallet_address = serializers.CharField()
    signature = serializers.CharField()
    message = serializers.CharField()
    chain_id = serializers.IntegerField(default=1)


class DeviceTrustEvaluationSerializer(serializers.Serializer):
    device_id = serializers.CharField()
    device_fingerprint = serializers.CharField(required=False)


class SessionCreateSerializer(serializers.Serializer):
    device_id = serializers.CharField()
    ip_address = serializers.CharField()
    location = serializers.JSONField(required=False)


class JITAccessRequestSerializer(serializers.Serializer):
    resource = serializers.CharField()
    access_level = serializers.CharField()
    justification = serializers.CharField()
    duration_minutes = serializers.IntegerField(default=60)
