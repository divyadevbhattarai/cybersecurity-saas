from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import URLValidator
from users.models import Tenant
from security.validators import SSRFProtectedURLValidator

User = get_user_model()


class Playbook(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='playbooks',
        null=True,
        blank=True
    )
    TRIGGER_TYPES = [
        ('manual', 'Manual'),
        ('automatic', 'Automatic'),
        ('scheduled', 'Scheduled'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('archived', 'Archived'),
    ]
    
    name = models.CharField(max_length=255)
    description = models.TextField()
    trigger_type = models.CharField(max_length=20, choices=TRIGGER_TYPES, default='manual')
    trigger_conditions = models.JSONField(default=dict)
    actions = models.JSONField(default=list)
    conditions = models.JSONField(default=list)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    priority = models.IntegerField(default=5)
    estimated_duration = models.IntegerField(help_text="Duration in minutes")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_playbooks')
    last_run = models.DateTimeField(null=True, blank=True)
    run_count = models.IntegerField(default=0)
    success_count = models.IntegerField(default=0)
    failure_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class PlaybookRun(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='playbook_runs',
        null=True,
        blank=True
    )
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]
    
    playbook = models.ForeignKey(Playbook, on_delete=models.CASCADE, related_name='runs')
    triggered_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    execution_log = models.JSONField(default=list)
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.playbook.name} - {self.status}"


class SecurityAgent(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='security_agents',
        null=True,
        blank=True
    )
    AGENT_TYPES = [
        ('monitoring', 'Monitoring'),
        ('remediation', 'Remediation'),
        ('investigation', 'Investigation'),
        ('threat_hunting', 'Threat Hunting'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('error', 'Error'),
    ]
    
    name = models.CharField(max_length=255)
    agent_type = models.CharField(max_length=50, choices=AGENT_TYPES)
    description = models.TextField()
    configuration = models.JSONField(default=dict)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='inactive')
    last_heartbeat = models.DateTimeField(null=True, blank=True)
    assigned_playbooks = models.ManyToManyField(Playbook, related_name='assigned_agents', blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.agent_type})"


class Webhook(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='webhooks',
        null=True,
        blank=True
    )
    name = models.CharField(max_length=255)
    url = models.URLField(validators=[SSRFProtectedURLValidator()])
    headers = models.JSONField(default=dict)
    events = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
