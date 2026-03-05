from django.db import models
from django.contrib.auth import get_user_model
from users.models import Tenant

User = get_user_model()


class Honeypot(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='honeypots',
        null=True,
        blank=True
    )
    TYPE_CHOICES = [
        ('database', 'Database'),
        ('web', 'Web Service'),
        ('ssh', 'SSH'),
        ('rdp', 'RDP'),
        ('smb', 'SMB'),
        ('http', 'HTTP'),
        ('dns', 'DNS'),
        ('custom', 'Custom'),
    ]

    name = models.CharField(max_length=255)
    endpoint = models.CharField(max_length=500)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='web')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.type}"


class CanaryToken(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='canary_tokens',
        null=True,
        blank=True
    )
    TYPE_CHOICES = [
        ('url', 'URL'),
        ('file', 'File'),
        ('dns', 'DNS'),
        ('email', 'Email'),
        ('aws', 'AWS'),
        ('git', 'Git'),
        ('cookie', 'Cookie'),
        ('custom', 'Custom'),
    ]

    token = models.CharField(max_length=255, unique=True)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='url')
    target = models.CharField(max_length=500, blank=True)
    is_active = models.BooleanField(default=True)
    triggered_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.token[:20]}... - {self.type}"


class ThreatHunt(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='threat_hunts',
        null=True,
        blank=True
    )
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    name = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    ioc_data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.status}"
