"""
Security middleware for tenant isolation and request validation.
Implements Zero Trust Architecture principles.
"""
import threading
import hashlib
import time
import hmac
import json
import logging
from typing import Optional, Callable, Any
from functools import wraps

from django.conf import settings
from django.core.cache import cache
from django.http import JsonResponse, HttpRequest, HttpResponse

logger = logging.getLogger(__name__)


class TenantContext:
    """
    Thread-local tenant context for maintaining tenant isolation.
    Zero Trust: Never trust, always verify tenant context at each layer.
    """
    _thread_local = threading.local()
    
    @classmethod
    def set_tenant(cls, tenant_id: int, tenant_slug: str = None):
        cls._thread_local.tenant_id = tenant_id
        cls._thread_local.tenant_slug = tenant_slug
    
    @classmethod
    def get_tenant(cls) -> Optional[int]:
        return getattr(cls._thread_local, 'tenant_id', None)
    
    @classmethod
    def get_tenant_slug(cls) -> Optional[str]:
        return getattr(cls._thread_local, 'tenant_slug', None)
    
    @classmethod
    def clear(cls):
        cls._thread_local.tenant_id = None
        cls._thread_local.tenant_slug = None


class TenantMiddleware:
    """
    Middleware to extract and set tenant context from various sources.
    Implements defense-in-depth: verify tenant at every request.
    """
    
    def __init__(self, get_response: Callable):
        self.get_response = get_response
    
    def __call__(self, request: HttpRequest) -> HttpResponse:
        tenant_id = self._extract_tenant(request)
        
        if tenant_id:
            TenantContext.set_tenant(tenant_id)
        
        try:
            response = self.get_response(request)
        finally:
            TenantContext.clear()
        
        return response
    
    def _extract_tenant(self, request: HttpRequest) -> Optional[int]:
        """Extract tenant from JWT, API key, or other auth mechanism."""
        
        # From JWT claims (primary)
        if hasattr(request, 'auth') and request.auth:
            tenant_id = request.auth.get('tenant_id')
            if tenant_id:
                return int(tenant_id)
        
        # From Authorization header (Bearer token)
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            token = auth_header[7:]
            tenant_id = self._get_tenant_from_token(token)
            if tenant_id:
                return tenant_id
        
        # From API key header
        api_key = request.headers.get('X-API-Key')
        if api_key:
            return self._get_tenant_from_api_key(api_key)
        
        # From tenant-specific subdomain (for web clients)
        host = request.headers.get('Host', '')
        if '.cybershield.com' in host:
            subdomain = host.split('.')[0]
            return self._get_tenant_from_subdomain(subdomain)
        
        return None
    
    def _get_tenant_from_token(self, token: str) -> Optional[int]:
        """Decode JWT and extract tenant claim."""
        try:
            # Use simple jwt decode without validation for tenant extraction
            # Full validation happens in authentication backend
            from jose import jwt
            from django.conf import settings
            
            # Try to get unverified claims for tenant extraction
            unverified = jwt.get_unverified_claims(token)
            return unverified.get('tenant_id')
        except Exception:
            return None
    
    def _get_tenant_from_api_key(self, api_key: str) -> Optional[int]:
        """Look up tenant from API key in cache/database."""
        cache_key = f"api_key_tenant:{hashlib.sha256(api_key.encode()).hexdigest()[:16]}"
        
        cached = cache.get(cache_key)
        if cached:
            return cached
        
        # Would query database in production
        # tenant = APIKey.objects.filter(key=api_key).first()
        # if tenant:
        #     cache.set(cache_key, tenant.id, 3600)
        #     return tenant.id
        
        return None
    
    def _get_tenant_from_subdomain(self, subdomain: str) -> Optional[int]:
        """Look up tenant from subdomain."""
        # Would query database in production
        # return Tenant.objects.filter(slug=subdomain).values_list('id', flat=True).first()
        return None


class RequestSigningMiddleware:
    """
    Middleware to verify request signatures for replay attack prevention.
    Implements integrity verification as part of Zero Trust.
    """
    
    def __init__(self, get_response: Callable):
        self.get_response = get_response
    
    def __call__(self, request: HttpRequest) -> HttpResponse:
        # Only validate write methods
        if request.method in ('POST', 'PUT', 'PATCH', 'DELETE'):
            result = self._validate_signed_request(request)
            if result:
                return result
        
        return self.get_response(request)
    
    def _validate_signed_request(self, request: HttpRequest) -> Optional[HttpResponse]:
        """Validate request signature and timestamp."""
        
        signature = request.headers.get('X-Request-Signature')
        timestamp = request.headers.get('X-Request-Timestamp')
        nonce = request.headers.get('X-Request-Nonce')
        
        if not signature or not timestamp:
            return JsonResponse(
                {'error': 'Missing request signature'},
                status=401
            )
        
        # Validate timestamp (prevent replay attacks)
        try:
            req_time = int(timestamp)
            current_time = int(time.time())
            
            if abs(current_time - req_time) > 300:  # 5 minutes
                return JsonResponse(
                    {'error': 'Request expired'},
                    status=401
                )
        except ValueError:
            return JsonResponse(
                {'error': 'Invalid timestamp'},
                status=401
            )
        
        # Check nonce (prevent replay)
        if nonce:
            nonce_key = f"nonce:{nonce}"
            if cache.get(nonce_key):
                return JsonResponse(
                    {'error': 'Request already processed'},
                    status=401
                )
            cache.set(nonce_key, True, 300)
        
        # Verify signature
        signing_key = getattr(settings, 'API_SIGNING_KEY', None)
        if not signing_key:
            return JsonResponse(
                {'error': 'Server misconfiguration'},
                status=500
            )
        
        payload = f"{request.method}:{request.path}:{timestamp}:{nonce or ''}:{request.body.decode('utf-8', errors='replace')}"
        expected_signature = hmac.new(
            signing_key.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()
        
        if not hmac.compare_digest(signature, expected_signature):
            logger.warning(
                f"Invalid request signature from {request.META.get('REMOTE_ADDR')}"
            )
            return JsonResponse(
                {'error': 'Invalid signature'},
                status=401
            )
        
        return None


class TenantRateThrottleMiddleware:
    """
    Rate limiting middleware with tenant isolation.
    Implements DoS protection as part of defense-in-depth.
    """
    
    def __init__(self, get_response: Callable):
        self.get_response = get_response
        self.rate_limits = {
            'default': 100,
            'tenant': 1000,
            'ip': 60,
            'api_key': 1000,
            'auth': 10,
        }
        self.auth_endpoints = ['/api/v1/users/login/', '/api/v1/users/register/']
    
    def __call__(self, request: HttpRequest) -> HttpResponse:
        tenant_id = TenantContext.get_tenant()
        
        if not self._check_rate_limits(request, tenant_id):
            return JsonResponse(
                {'error': 'Rate limit exceeded'},
                status=429,
                headers={
                    'Retry-After': '60',
                    'X-RateLimit-Limit': str(self.rate_limits.get('default')),
                }
            )
        
        return self.get_response(request)
    
    def _check_rate_limits(self, request: HttpRequest, tenant_id: Optional[int]) -> bool:
        """Check all rate limits."""
        
        # Auth-specific rate limiting
        if any(request.path.startswith(auth) for auth in self.auth_endpoints):
            if not self._check_single_limit(f"rate:auth:{self._get_client_ip(request)}", self.rate_limits.get('auth', 10)):
                return False
        
        # IP-based limit
        ip = request.META.get('REMOTE_ADDR')
        if not self._check_single_limit(f"rate:ip:{ip}", self.rate_limits.get('ip', 60)):
            return False
        
        # Tenant-based limit
        if tenant_id:
            if not self._check_single_limit(f"rate:tenant:{tenant_id}", self.rate_limits.get('tenant', 1000)):
                return False
        
        # API key-based limit
        api_key = request.headers.get('X-API-Key')
        if api_key:
            key_hash = hashlib.sha256(api_key.encode()).hexdigest()[:16]
            if not self._check_single_limit(f"rate:api_key:{key_hash}", self.rate_limits.get('api_key', 1000)):
                return False
        
        return True
    
    def _check_single_limit(self, key: str, limit: int) -> bool:
        """Check rate limit using sliding window."""
        now = time.time()
        window = 60  # 1 minute
        
        timestamps = cache.get(key, [])
        timestamps = [t for t in timestamps if t > now - window]
        
        if len(timestamps) >= limit:
            return False
        
        timestamps.append(now)
        cache.set(key, timestamps, window + 1)
        
        return True
    
    def _get_client_ip(self, request: HttpRequest) -> str:
        """Extract client IP from request."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR', '')


def require_tenant_context(func: Callable) -> Callable:
    """
    Decorator to ensure tenant context is set.
    Defense-in-depth: Verify tenant at function level.
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        tenant_id = TenantContext.get_tenant()
        if tenant_id is None:
            return JsonResponse(
                {'error': 'Tenant context required'},
                status=403
            )
        return func(*args, **kwargs)
    return wrapper


class TenantCacheMixin:
    """
    Mixin to ensure tenant-scoped caching.
    Prevents cross-tenant data leakage in cache.
    """
    
    def get_cache_key(self, base_key: str) -> str:
        """Prefix key with tenant ID."""
        tenant_id = TenantContext.get_tenant()
        if tenant_id:
            return f"tenant:{tenant_id}:{base_key}"
        return f"global:{base_key}"
    
    def cache_get(self, key: str, default=None):
        """Tenant-scoped cache get."""
        return cache.get(self.get_cache_key(key), default)
    
    def cache_set(self, key: str, value: Any, timeout: int = 300):
        """Tenant-scoped cache set."""
        return cache.set(self.get_cache_key(key), value, timeout)
    
    def cache_delete(self, key: str):
        """Tenant-scoped cache delete."""
        return cache.delete(self.get_cache_key(key))


class ContentSecurityPolicyMiddleware:
    """
    Middleware to add Content Security Policy headers.
    Helps prevent XSS and data injection attacks.
    """
    
    def __init__(self, get_response: Callable):
        self.get_response = get_response
        from django.conf import settings
        self.csp_settings = {
            'default-src': getattr(settings, 'CSP_DEFAULT_SRC', ("'self'",)),
            'script-src': getattr(settings, 'CSP_SCRIPT_SRC', ("'self'",)),
            'style-src': getattr(settings, 'CSP_STYLE_SRC', ("'self'",)),
            'img-src': getattr(settings, 'CSP_IMG_SRC', ("'self'", 'data:')),
            'connect-src': getattr(settings, 'CSP_CONNECT_SRC', ("'self'",)),
            'font-src': getattr(settings, 'CSP_FONT_SRC', ("'self'",)),
            'object-src': getattr(settings, 'CSP_OBJECT_SRC', ("'none'",)),
            'base-uri': getattr(settings, 'CSP_BASE_URI', ("'self'",)),
            'frame-ancestors': getattr(settings, 'CSP_FRAME_ANCESTORS', ("'none'",)),
        }
    
    def __call__(self, request: HttpRequest) -> HttpResponse:
        response = self.get_response(request)
        
        if not getattr(settings, 'DEBUG', False):
            csp_header = '; '.join(
                f"{key} {' '.join(values)}"
                for key, values in self.csp_settings.items()
            )
            response['Content-Security-Policy'] = csp_header
        
        return response


import re


class SQLInjectionProtectionMiddleware:
    """
    Middleware to detect and block SQL injection attempts.
    OWASP A03:2021 - Injection
    """
    
    SQL_INJECTION_PATTERNS = [
        r"(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE)\b.*\b(FROM|TABLE|DATABASE)\b)",
        r"(--|#|\/\*|\*\/)",
        r"(\bOR\b.*\b=\b|\bAND\b.*\b=\b)",
        r"('(.|\\n)*')",
        r"(0x[0-9a-fA-F]+)",
        r"(\bEXEC(\b|\s+|\())",
        r"(\bxp_cmdshell\b)",
        r"(\bsleep\s*\()",
        r"(\bwaitfor\s+delay\b)",
        r"(\bbenchmark\s*\()",
        r"(/\*!.*\*/)",
    ]
    
    def __init__(self, get_response: Callable):
        self.get_response = get_response
        self.compiled_patterns = [re.compile(p, re.IGNORECASE) for p in self.SQL_INJECTION_PATTERNS]
    
    def __call__(self, request: HttpRequest) -> HttpResponse:
        if request.method in ('GET', 'POST', 'PUT', 'PATCH', 'DELETE'):
            suspicious_input = self._check_request(request)
            if suspicious_input:
                logger.warning(
                    f"SQL injection attempt detected from {request.META.get('REMOTE_ADDR')}: {suspicious_input}"
                )
                return JsonResponse(
                    {'error': 'Invalid request'},
                    status=400
                )
        
        return self.get_response(request)
    
    def _check_request(self, request: HttpRequest) -> str:
        """Check request parameters for SQL injection patterns."""
        
        # Check query parameters
        for key, value in request.GET.items():
            if self._contains_sql_pattern(str(value)):
                return f"GET param {key}: {value}"
        
        # Check POST data
        if hasattr(request, 'POST'):
            for key, value in request.POST.items():
                if self._contains_sql_pattern(str(value)):
                    return f"POST param {key}: {value}"
        
        return ""
    
    def _contains_sql_pattern(self, value: str) -> bool:
        """Check if value contains SQL injection patterns."""
        for pattern in self.compiled_patterns:
            if pattern.search(value):
                return True
        return False


class CommandInjectionProtectionMiddleware:
    """
    Middleware to detect and block command injection attempts.
    OWASP A03:2021 - Injection
    """
    
    COMMAND_INJECTION_PATTERNS = [
        r"[;&|`$]",
        r"\$\(",
        r"`",
        r"\|\s*\w+",
        r"&\s*\w+",
        r";\s*\w+",
        r"\b(cat|ls|dir|echo|rm|mkdir|wget|curl|nc|bash|sh|cmd)\b",
        r"\b(whoami|id|uname|hostname)\b",
        r"\/etc\/passwd",
        r"\/etc\/shadow",
        r"\.\.\/",
        r"%0a",
        r"%0d",
    ]
    
    def __init__(self, get_response: Callable):
        self.get_response = get_response
        self.compiled_patterns = [re.compile(p, re.IGNORECASE) for p in self.COMMAND_INJECTION_PATTERNS]
    
    def __call__(self, request: HttpRequest) -> HttpResponse:
        if request.method in ('GET', 'POST', 'PUT', 'PATCH', 'DELETE'):
            suspicious_input = self._check_request(request)
            if suspicious_input:
                logger.warning(
                    f"Command injection attempt detected from {request.META.get('REMOTE_ADDR')}: {suspicious_input}"
                )
                return JsonResponse(
                    {'error': 'Invalid request'},
                    status=400
                )
        
        return self.get_response(request)
    
    def _check_request(self, request: HttpRequest) -> str:
        """Check request parameters for command injection patterns."""
        
        for key, value in request.GET.items():
            if self._contains_command_pattern(str(value)):
                return f"GET param {key}: {value}"
        
        if hasattr(request, 'POST'):
            for key, value in request.POST.items():
                if self._contains_command_pattern(str(value)):
                    return f"POST param {key}: {value}"
        
        return ""
    
    def _contains_command_pattern(self, value: str) -> bool:
        """Check if value contains command injection patterns."""
        for pattern in self.compiled_patterns:
            if pattern.search(value):
                return True
        return False


class ClickjackingProtectionMiddleware:
    """
    Middleware to add X-Frame-Options header for clickjacking protection.
    OWASP A06:2021 - Security Misconfiguration
    """
    
    def __init__(self, get_response: Callable):
        self.get_response = get_response
    
    def __call__(self, request: HttpRequest) -> HttpResponse:
        response = self.get_response(request)
        
        # Add X-Frame-Options header
        response['X-Frame-Options'] = 'DENY'
        
        return response


class HSTSMiddleware:
    """
    Middleware to add Strict-Transport-Security header.
    OWASP A02:2021 - Cryptographic Failures
    """
    
    def __init__(self, get_response: Callable):
        self.get_response = get_response
    
    def __call__(self, request: HttpRequest) -> HttpResponse:
        response = self.get_response(request)
        
        # Only add HSTS in production
        if not getattr(settings, 'DEBUG', False):
            response['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'
        
        return response
