from rest_framework import serializers
from .models import BiometricProfile, Web3Identity, ZTNAProfile, AccessRequest


class BiometricProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = BiometricProfile
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'behavioral_score', 'is_verified']


class Web3IdentitySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Web3Identity
        fields = '__all__'
        read_only_fields = ['did', 'is_verified', 'created_at', 'updated_at']


class ZTNAProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = ZTNAProfile
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'trust_score', 'is_trusted']


class AccessRequestSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    approved_by_username = serializers.CharField(source='approved_by.username', read_only=True)
    
    class Meta:
        model = AccessRequest
        fields = '__all__'
        read_only_fields = ['approved_by', 'approved_at', 'created_at', 'user']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


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
