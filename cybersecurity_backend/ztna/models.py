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


class MicroSegment(models.Model):
    """Micro-segmentation for zero-trust network architecture"""
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='micro_segments',
        null=True,
        blank=True
    )
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    segment_type = models.CharField(max_length=50, choices=[
        ('application', 'Application'),
        ('database', 'Database'),
        ('workload', 'Workload'),
        ('endpoint', 'Endpoint'),
        ('user_group', 'User Group'),
    ])
    isolation_level = models.CharField(max_length=20, choices=[
        ('strict', 'Strict'),
        ('standard', 'Standard'),
        ('relaxed', 'Relaxed'),
    ], default='standard')
    allowed_sources = models.JSONField(default=list)
    allowed_destinations = models.JSONField(default=list)
    required_auth = models.JSONField(default=dict)
    firewall_rules = models.JSONField(default=list)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.segment_type})"


class DeviceTrustScore(models.Model):
    """Device trust scoring for zero-trust evaluation"""
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='device_trust_scores',
        null=True,
        blank=True
    )
    device_id = models.CharField(max_length=255, db_index=True)
    device_fingerprint = models.CharField(max_length=500)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='device_trusts', db_index=True)
    
    TRUST_FACTORS = [
        ('device_health', 'Device Health'),
        ('patch_level', 'Patch Level'),
        ('encryption_status', 'Encryption Status'),
        ('biometric_enrolled', 'Biometric Enrolled'),
        ('mdm_enrolled', 'MDM Enrolled'),
        ('jailbreak_status', 'Jailbreak Status'),
        ('location_anomaly', 'Location Anomaly'),
        ('network_trust', 'Network Trust'),
    ]
    
    trust_score = models.FloatField(default=50.0)
    factor_scores = models.JSONField(default=dict)
    overall_verdict = models.CharField(max_length=20, choices=[
        ('trusted', 'Trusted'),
        ('untrusted', 'Untrusted'),
        ('conditional', 'Conditional'),
        ('unknown', 'Unknown'),
    ], default='unknown')
    last_evaluated = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField()
    remediation_actions = models.JSONField(default=list)

    class Meta:
        ordering = ['-last_evaluated']

    def __str__(self):
        return f"Device {self.device_id[:8]}... - Score: {self.trust_score}"


class SessionMonitoring(models.Model):
    """Real-time session monitoring for zero-trust"""
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='session_monitorings',
        null=True,
        blank=True
    )
    session_id = models.CharField(max_length=255, unique=True, db_index=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions', db_index=True)
    device_id = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField()
    location = models.JSONField(default=dict)
    
    SESSION_STATES = [
        ('active', 'Active'),
        ('suspended', 'Suspended'),
        ('expired', 'Expired'),
        ('terminated', 'Terminated'),
    ]
    
    state = models.CharField(max_length=20, choices=SESSION_STATES, default='active', db_index=True)
    risk_score = models.FloatField(default=0.0)
    activities = models.JSONField(default=list)
    resource_access = models.JSONField(default=list)
    started_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField()
    terminated_at = models.DateTimeField(null=True, blank=True)
    termination_reason = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ['-last_activity']

    def __str__(self):
        return f"Session {self.session_id[:8]}... - {self.state}"


class JITAccess(models.Model):
    """Just-in-Time access management"""
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='jit_access_grants',
        null=True,
        blank=True
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='jit_grants', db_index=True)
    resource = models.CharField(max_length=255, db_index=True)
    access_level = models.CharField(max_length=50)
    justification = models.TextField()
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('denied', 'Denied'),
        ('revoked', 'Revoked'),
        ('expired', 'Expired'),
    ]
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='jit_approvals')
    approved_at = models.DateTimeField(null=True, blank=True)
    access_start = models.DateTimeField()
    access_end = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.resource} - {self.status}"
