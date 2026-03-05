"""
Advanced API Authentication and Security Hardening.
Implements API keys, device fingerprinting, request signing, and enhanced JWT security.
"""
import hashlib
import hmac
import secrets
import time
import uuid
from datetime import timedelta
from typing import Optional, Tuple

from django.conf import settings
from django.core.cache import cache
from django.utils import timezone


def _get_tenant_context():
    from .middleware import TenantContext
    return TenantContext


class DeviceFingerprint:
    """Device fingerprinting for enhanced security tracking."""
    
    @staticmethod
    def generate_fingerprint(request) -> str:
        """Generate a unique device fingerprint from request headers."""
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        accept_language = request.META.get('HTTP_ACCEPT_LANGUAGE', '')
        accept_encoding = request.META.get('HTTP_ACCEPT_ENCODING', '')
        
        fingerprint_components = [
            user_agent,
            accept_language,
            accept_encoding,
            request.META.get('HTTP_ACCEPT', ''),
            request.META.get('REMOTE_ADDR', ''),
        ]
        
        fingerprint = '|'.join(fingerprint_components)
        return hashlib.sha256(fingerprint.encode()).hexdigest()

    @staticmethod
    def get_client_ip(request) -> str:
        """Extract real client IP, handling proxies."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR', '')


class RequestSignatureValidator:
    """Validate API request signatures to prevent replay attacks."""
    
    SIGNATURE_EXPIRY_SECONDS = 300
    
    @staticmethod
    def generate_signature(
        method: str,
        path: str,
        body: str,
        timestamp: int,
        secret: str
    ) -> str:
        """Generate HMAC signature for a request."""
        message = f"{method}:{path}:{body}:{timestamp}"
        signature = hmac.new(
            secret.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
        return signature
    
    @staticmethod
    def validate_signature(
        method: str,
        path: str,
        body: str,
        timestamp: int,
        signature: str,
        secret: str
    ) -> bool:
        """Validate request signature."""
        current_time = int(time.time())
        if abs(current_time - timestamp) > RequestSignatureValidator.SIGNATURE_EXPIRY_SECONDS:
            return False
        
        expected_signature = RequestSignatureValidator.generate_signature(
            method, path, body, timestamp, secret
        )
        return hmac.compare_digest(signature, expected_signature)


class APIKeyAuthentication:
    """Custom authentication class for API Key authentication."""
    
    def authenticate(self, request):
        from rest_framework import exceptions
        from .models import APIKey
        
        auth_header = request.META.get('HTTP_X_API_KEY', '')
        
        if not auth_header:
            return None
        
        parts = auth_header.split(' ')
        if len(parts) != 2:
            raise exceptions.AuthenticationFailed('Invalid API key format')
        
        prefix, raw_key = parts
        key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
        
        try:
            api_key = APIKey.objects.select_related('user', 'tenant').get(
                key_hash=key_hash,
                key_prefix=prefix
            )
        except APIKey.DoesNotExist:
            raise exceptions.AuthenticationFailed('Invalid API key')
        
        if not api_key.is_valid():
            raise exceptions.APIException('API key is expired or inactive')
        
        if not api_key.check_rate_limit():
            raise exceptions.Throttled('API key rate limit exceeded')
        
        client_ip = DeviceFingerprint.get_client_ip(request)
        if api_key.allowed_ips and client_ip not in api_key.allowed_ips:
            raise exceptions.PermissionDenied('IP not allowed')
        
        api_key.last_used_at = timezone.now()
        api_key.save(update_fields=['last_used_at'])
        
        if api_key.tenant:
            TenantContext = _get_tenant_context()
            TenantContext.set_tenant(api_key.tenant.id, api_key.tenant.slug)
        
        return (api_key.user, api_key)


class SignedRequestAuthentication:
    """Authentication via signed requests (HMAC)."""
    
    def authenticate(self, request):
        from rest_framework import exceptions
        from .models import APIKey
        
        signature = request.META.get('HTTP_X_REQUEST_SIGNATURE', '')
        timestamp = request.META.get('HTTP_X_REQUEST_TIMESTAMP', '')
        api_key_id = request.META.get('HTTP_X_API_KEY_ID', '')
        
        if not all([signature, timestamp, api_key_id]):
            return None
        
        try:
            timestamp = int(timestamp)
        except ValueError:
            raise exceptions.AuthenticationFailed('Invalid timestamp')
        
        try:
            api_key = APIKey.objects.get(id=api_key_id, is_active=True)
        except APIKey.DoesNotExist:
            raise exceptions.AuthenticationFailed('Invalid API key')
        
        body = request.body.decode('utf-8') if request.body else ''
        
        if not RequestSignatureValidator.validate_signature(
            request.method,
            request.path,
            body,
            timestamp,
            signature,
            api_key.key_hash
        ):
            raise exceptions.AuthenticationFailed('Invalid signature')
        
        if api_key.tenant:
            TenantContext = _get_tenant_context()
            TenantContext.set_tenant(api_key.tenant.id, api_key.tenant.slug)
        
        return (api_key.user, api_key)


class TenantAPIKeyPermission:
    """Permission class for API key based access with tenant isolation."""
    
    def has_permission(self, request, view):
        from .models import APIKey
        if not hasattr(request, 'auth') or not request.auth:
            return False
        
        if isinstance(request.auth, APIKey):
            return True
        return False


class MultiFactorAuthenticationPermission:
    """Permission that requires 2FA for sensitive operations."""
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        sensitive_endpoints = [
            '/api/v1/users/',
            '/api/v1/settings/',
            '/api/v1/billing/',
            '/api/v1/admin/',
        ]
        
        path = request.path
        if any(path.startswith(endpoint) for endpoint in sensitive_endpoints):
            if not request.user.is_totp_enabled:
                return False
        
        return True


class TokenIntrospectionMiddleware:
    """Middleware to handle token introspection and validation."""
    
    @staticmethod
    def add_security_headers(response):
        """Add security headers to response."""
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        return response


def generate_jti() -> str:
    """Generate a unique JWT ID."""
    return f"{uuid.uuid4().hex}{secrets.token_hex(8)}"


def get_token_metadata(request) -> dict:
    """Extract token metadata from request for auditing."""
    TenantContext = _get_tenant_context()
    return {
        'ip_address': DeviceFingerprint.get_client_ip(request),
        'user_agent': request.META.get('HTTP_USER_AGENT', ''),
        'device_fingerprint': DeviceFingerprint.generate_fingerprint(request),
        'tenant_id': TenantContext.get_tenant(),
    }
