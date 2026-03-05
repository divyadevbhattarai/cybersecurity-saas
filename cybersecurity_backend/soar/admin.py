from django.contrib import admin
from .models import Playbook, PlaybookRun, SecurityAgent, Webhook


@admin.register(Playbook)
class PlaybookAdmin(admin.ModelAdmin):
    list_display = ['name', 'trigger_type', 'status', 'priority', 'created_by', 'last_run']
    list_filter = ['status', 'trigger_type']
    search_fields = ['name', 'description']


@admin.register(PlaybookRun)
class PlaybookRunAdmin(admin.ModelAdmin):
    list_display = ['playbook', 'status', 'triggered_by', 'started_at', 'completed_at']
    list_filter = ['status']
    search_fields = ['playbook__name']


@admin.register(SecurityAgent)
class SecurityAgentAdmin(admin.ModelAdmin):
    list_display = ['name', 'agent_type', 'status', 'created_by', 'last_heartbeat']
    list_filter = ['status', 'agent_type']
    search_fields = ['name']


@admin.register(Webhook)
class WebhookAdmin(admin.ModelAdmin):
    list_display = ['name', 'url', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name']
