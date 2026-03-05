from django.db import models
from django.contrib.auth import get_user_model
from users.models import Tenant

User = get_user_model()


class EncryptionKey(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='encryption_keys',
        null=True,
        blank=True
    )
    ALGORITHM_CHOICES = [
        ('aes256', 'AES-256'),
        ('aes512', 'AES-512'),
        ('rsa4096', 'RSA-4096'),
        ('rsa8192', 'RSA-8192'),
        ('kyber512', 'Kyber-512'),
        ('kyber1024', 'Kyber-1024'),
        ('dilithium2', 'Dilithium-2'),
        ('dilithium3', 'Dilithium-3'),
    ]

    name = models.CharField(max_length=255)
    algorithm = models.CharField(max_length=50, choices=ALGORITHM_CHOICES)
    key_data = models.TextField()
    is_active = models.BooleanField(default=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.algorithm}"


class KeyRotation(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='key_rotations',
        null=True,
        blank=True
    )
    key = models.ForeignKey(EncryptionKey, on_delete=models.CASCADE, related_name='rotations')
    old_key = models.ForeignKey(EncryptionKey, on_delete=models.SET_NULL, null=True, related_name='replaced_by')
    rotated_at = models.DateTimeField(auto_now_add=True)
    rotated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    class Meta:
        ordering = ['-rotated_at']

    def __str__(self):
        return f"Rotation for {self.key.name}"
