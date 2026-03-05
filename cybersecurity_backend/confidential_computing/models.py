from django.db import models
import uuid
from users.models import Tenant


class Enclave(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='enclaves',
        null=True,
        blank=True
    )
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('initializing', 'Initializing'),
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('terminated', 'Terminated'),
    ]

    ENCLAVE_TYPE_CHOICES = [
        ('intel_sgx', 'Intel SGX'),
        ('amd_sev', 'AMD SEV'),
        ('arm_tee', 'ARM TEE'),
        ('custom', 'Custom'),
    ]

    name = models.CharField(max_length=255)
    enclave_type = models.CharField(max_length=50, choices=ENCLAVE_TYPE_CHOICES, default='intel_sgx')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    attestation_data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.enclave_type}"


class SecureSession(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='secure_sessions',
        null=True,
        blank=True
    )
    enclave = models.ForeignKey(Enclave, on_delete=models.CASCADE, related_name='sessions')
    session_id = models.CharField(max_length=255, unique=True, default=uuid.uuid4)
    started_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-started_at']

    def __str__(self):
        return f"Session {self.session_id} for {self.enclave.name}"
