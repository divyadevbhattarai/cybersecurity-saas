from django.db import models
from django.contrib.auth import get_user_model
from users.models import Tenant

User = get_user_model()


class BiometricProfile(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='biometric_profiles',
        null=True,
        blank=True
    )
    DEVICE_CHOICES = [
        ('laptop', 'Laptop'),
        ('mobile', 'Mobile'),
        ('tablet', 'Tablet'),
        ('desktop', 'Desktop'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='biometric_profiles', db_index=True)
    device_id = models.CharField(max_length=255, db_index=True)
    device_type = models.CharField(max_length=50, choices=DEVICE_CHOICES)
    keystroke_pattern = models.JSONField(default=dict)
    mouse_movement_pattern = models.JSONField(default=dict)
    touch_pattern = models.JSONField(default=dict)
    voice_pattern = models.JSONField(default=dict, blank=True)
    behavioral_score = models.FloatField(default=100.0)
    is_verified = models.BooleanField(default=False, db_index=True)
    last_verified = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.device_type}"


class Web3Identity(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='web3_identities',
        null=True,
        blank=True
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='web3_identity')
    wallet_address = models.CharField(max_length=100, unique=True, db_index=True)
    did = models.CharField(max_length=255, unique=True)
    nonce = models.CharField(max_length=100)
    signature = models.TextField(blank=True)
    chain_id = models.IntegerField(default=1)
    is_verified = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.wallet_address[:10]}..."


class ZTNAProfile(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='ztna_profiles',
        null=True,
        blank=True
    )
    ACCESS_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ztna_profiles', db_index=True)
    device_id = models.CharField(max_length=255, db_index=True)
    ip_address = models.GenericIPAddressField(db_index=True)
    location = models.JSONField(default=dict)
    device_fingerprint = models.CharField(max_length=500)
    trust_score = models.FloatField(default=50.0)
    access_level = models.CharField(max_length=20, choices=ACCESS_LEVELS, default='low', db_index=True)
    is_trusted = models.BooleanField(default=False, db_index=True)
    risk_level = models.CharField(max_length=50, default='unknown', db_index=True)
    last_access = models.DateTimeField(null=True, blank=True)
    session_active = models.BooleanField(default=False, db_index=True)
    session_expires_at = models.DateTimeField(null=True, blank=True)
    jit_access = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.access_level}"


class AccessRequest(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='access_requests',
        null=True,
        blank=True
    )
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('denied', 'Denied'),
        ('revoked', 'Revoked'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='access_requests', db_index=True)
    resource = models.CharField(max_length=255, db_index=True)
    access_level = models.CharField(max_length=50)
    justification = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='approved_requests')
    approved_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.resource} - {self.status}"
