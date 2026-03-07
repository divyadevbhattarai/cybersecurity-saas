from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer as SimpleTokenObtainPairSerializer, TokenRefreshSerializer as SimpleTokenRefreshSerializer
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class TokenObtainPairSerializer(SimpleTokenObtainPairSerializer):
    """Custom serializer that adds tenant_id to token claims"""
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['tenant_id'] = getattr(user, 'tenant_id', None)
        token['username'] = user.username
        return token


class TokenRefreshSerializer(SimpleTokenRefreshSerializer):
    """Custom refresh serializer to handle cookie-based refresh"""
    pass
