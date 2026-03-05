"""
Security app models.
"""
import uuid
import hashlib

from django.db import models
from django.utils import timezone


class APIKey(models.Model):
    """API Key model for service-to-service authentication."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(
        'users.Tenant',
        on_delete=models.CASCADE,
        related_name='api_keys',
        null=True,
        blank=True
    )
    user = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='api_keys'
    )
    name = models.CharField(max_length=100)
    key_hash = models.CharField(max_length=128, unique=True, db_index=True)
    key_prefix = models.CharField(max_length=16)
    is_active = models.BooleanField(default=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    last_used_at = models.DateTimeField(null=True, blank=True)
    rate_limit = models.IntegerField(default=1000)
    allowed_ips = models.JSONField(default=list, blank=True)
    allowed_origins = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'api_keys'

    def __str__(self):
        return f"{self.name} ({self.key_prefix}...)"

    @staticmethod
    def hash_key(raw_key: str):
        """Hash an API key and return hash + prefix."""
        key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
        prefix = raw_key[:8]
        return key_hash, prefix

    @classmethod
    def create_key(cls, user, name: str, **kwargs):
        """Create a new API key, return the raw key (only once)."""
        raw_key = f"sk_{hashlib.sha256(str(uuid.uuid4()).encode()).hexdigest()[:40]}"
        key_hash, key_prefix = cls.hash_key(raw_key)
        
        cls.objects.create(
            user=user,
            name=name,
            key_hash=key_hash,
            key_prefix=key_prefix,
            **kwargs
        )
        return raw_key

    def is_valid(self) -> bool:
        """Check if API key is valid and not expired."""
        if not self.is_active:
            return False
        if self.expires_at and self.expires_at < timezone.now():
            return False
        return True

    def check_rate_limit(self) -> bool:
        """Check if the API key has exceeded its rate limit."""
        from django.core.cache import cache
        cache_key = f"api_key_rate:{self.id}"
        request_count = cache.get(cache_key, 0)
        return request_count < self.rate_limit

    def increment_rate_limit(self):
        """Increment the rate limit counter."""
        from django.core.cache import cache
        cache_key = f"api_key_rate:{self.id}"
        try:
            cache.incr(cache_key)
        except ValueError:
            cache.set(cache_key, 1, 3600)
