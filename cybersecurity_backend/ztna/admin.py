from django.contrib import admin
from .models import BiometricProfile, Web3Identity, ZTNAProfile, AccessRequest


@admin.register(BiometricProfile)
class BiometricProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'device_type', 'device_id', 'behavioral_score', 'is_verified', 'created_at']
    list_filter = ['device_type', 'is_verified']
    search_fields = ['user__username', 'device_id']


@admin.register(Web3Identity)
class Web3IdentityAdmin(admin.ModelAdmin):
    list_display = ['user', 'wallet_address', 'chain_id', 'is_verified', 'created_at']
    list_filter = ['is_verified', 'chain_id']
    search_fields = ['user__username', 'wallet_address']


@admin.register(ZTNAProfile)
class ZTNAProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'access_level', 'trust_score', 'is_trusted', 'session_active', 'created_at']
    list_filter = ['access_level', 'is_trusted', 'session_active']
    search_fields = ['user__username', 'device_id']


@admin.register(AccessRequest)
class AccessRequestAdmin(admin.ModelAdmin):
    list_display = ['user', 'resource', 'access_level', 'status', 'created_at']
    list_filter = ['status', 'access_level']
    search_fields = ['user__username', 'resource']
