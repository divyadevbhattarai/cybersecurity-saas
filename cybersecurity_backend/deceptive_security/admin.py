from django.contrib import admin
from .models import Honeypot, CanaryToken, ThreatHunt


@admin.register(Honeypot)
class HoneypotAdmin(admin.ModelAdmin):
    list_display = ['name', 'endpoint', 'type', 'is_active', 'created_at']
    list_filter = ['type', 'is_active']
    search_fields = ['name', 'endpoint']


@admin.register(CanaryToken)
class CanaryTokenAdmin(admin.ModelAdmin):
    list_display = ['token', 'type', 'is_active', 'triggered_at', 'created_at']
    list_filter = ['type', 'is_active', 'triggered_at']
    search_fields = ['token', 'target']


@admin.register(ThreatHunt)
class ThreatHuntAdmin(admin.ModelAdmin):
    list_display = ['name', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['name']
