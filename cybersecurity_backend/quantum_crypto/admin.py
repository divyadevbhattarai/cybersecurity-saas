from django.contrib import admin
from .models import EncryptionKey, KeyRotation


@admin.register(EncryptionKey)
class EncryptionKeyAdmin(admin.ModelAdmin):
    list_display = ['name', 'algorithm', 'is_active', 'expires_at', 'created_at']
    list_filter = ['algorithm', 'is_active']
    search_fields = ['name']


@admin.register(KeyRotation)
class KeyRotationAdmin(admin.ModelAdmin):
    list_display = ['key', 'old_key', 'rotated_by', 'rotated_at']
    search_fields = ['key__name', 'rotated_by__username']
