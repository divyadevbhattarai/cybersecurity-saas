from django.db import models
from django.contrib.auth import get_user_model
from users.models import Tenant

User = get_user_model()


class RASPApplication(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='rasp_applications',
        null=True,
        blank=True
    )
    name = models.CharField(max_length=255)
    description = models.TextField()
    language = models.CharField(max_length=50)
    version = models.CharField(max_length=50)
    endpoint = models.URLField()
    api_key = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    protection_level = models.CharField(max_length=50, default='standard')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class RASPEvent(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='rasp_events',
        null=True,
        blank=True
    )
    EVENT_TYPES = [
        ('sql_injection', 'SQL Injection'),
        ('xss', 'Cross-Site Scripting'),
        ('command_injection', 'Command Injection'),
        ('path_traversal', 'Path Traversal'),
        ('deserialization', 'Deserialization'),
        ('authentication_bypass', 'Authentication Bypass'),
        ('other', 'Other'),
    ]
    
    SEVERITY_CHOICES = [
        ('critical', 'Critical'),
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]
    
    application = models.ForeignKey(RASPApplication, on_delete=models.CASCADE, related_name='events')
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    description = models.TextField()
    request_data = models.JSONField(default=dict)
    stack_trace = models.TextField(blank=True)
    blocked = models.BooleanField(default=False)
    source_ip = models.GenericIPAddressField()
    user_id = models.CharField(max_length=255, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.event_type} - {self.severity}"


class RASPPolicy(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='rasp_policies',
        null=True,
        blank=True
    )
    name = models.CharField(max_length=255)
    description = models.TextField()
    rules = models.JSONField(default=dict)
    is_active = models.BooleanField(default=True)
    enforcement_mode = models.CharField(max_length=50, default='block')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
