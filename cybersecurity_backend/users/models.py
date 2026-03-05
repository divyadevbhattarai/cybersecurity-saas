from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings


class Tenant(models.Model):
    """Multi-tenant isolation model."""
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=50)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    subscription_tier = models.CharField(
        max_length=50,
        choices=[
            ('free', 'Free'),
            ('starter', 'Starter'),
            ('professional', 'Professional'),
            ('enterprise', 'Enterprise'),
        ],
        default='free'
    )
    max_users = models.IntegerField(default=5)
    max_api_calls = models.IntegerField(default=1000)
    
    class Meta:
        db_table = 'tenants'
    
    def __str__(self):
        return self.name


class User(AbstractUser):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='users',
        null=True,
        blank=True
    )
    email_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=64, blank=True, null=True)
    email_verification_expires = models.DateTimeField(blank=True, null=True)
    password_reset_token = models.CharField(max_length=64, blank=True, null=True)
    password_reset_expires = models.DateTimeField(blank=True, null=True)
    failed_login_attempts = models.IntegerField(default=0)
    locked_until = models.DateTimeField(blank=True, null=True)
    totp_secret = models.CharField(max_length=32, blank=True, null=True)
    is_totp_enabled = models.BooleanField(default=False)
    backup_codes = models.JSONField(default=list, blank=True)
    role = models.CharField(
        max_length=20,
        choices=[
            ('super_admin', 'Super Admin'),
            ('tenant_admin', 'Tenant Admin'),
            ('security_analyst', 'Security Analyst'),
            ('auditor', 'Auditor'),
            ('user', 'User'),
            ('viewer', 'Viewer'),
        ],
        default='user'
    )
    device_trust_score = models.IntegerField(default=0)
    mfa_methods = models.JSONField(default=list, blank=True)
    
    class Meta:
        db_table = 'users'
    
    @property
    def tenant_id(self):
        return self.tenant.id if self.tenant else None
    
    @property
    def tenant_slug(self):
        return self.tenant.slug if self.tenant else None
