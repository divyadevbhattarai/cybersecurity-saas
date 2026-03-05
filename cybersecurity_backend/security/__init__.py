"""
Security module initialization
Exports security components for easy importing
"""

from .middleware import (
    TenantContext,
    TenantMiddleware,
    RequestSigningMiddleware,
    TenantRateThrottleMiddleware,
    require_tenant_context,
    TenantCacheMixin,
    ContentSecurityPolicyMiddleware,
    SQLInjectionProtectionMiddleware,
    CommandInjectionProtectionMiddleware,
    ClickjackingProtectionMiddleware,
    HSTSMiddleware,
)

from .permissions import (
    Role,
    Permission,
    PermissionChecker,
    TenantPermission,
    RoleBasedPermission,
    ABACPermission,
    ObjectPermission,
    require_permission,
    require_abac,
    AuthorizationLogger,
)

from .crypto import (
    CryptographicError,
    EncryptedData,
    SecureKeyDerivation,
    AESEncryption,
    ChaChaEncryption,
    RSAEncryption,
    SecureFernet,
    DataEncryptionService,
    HashingService,
    SecureTokenGenerator,
    get_encryption_service,
)

# Import models so Django can find them
from . import advanced_auth
from .validators import (
    SSRFProtectedURLValidator,
    validate_ssrf_url,
    StrongPasswordValidator,
    InputSanitizer,
    sanitize_input,
    sanitize_request_data,
    FileUploadValidator,
    validate_file_upload,
    SanitizedSerializerMixin,
)
from .audit_logger import AuditLogger, audit_log, AuditLogMixin


def __getattr__(name):
    """Lazy load ViewSets and Serializers to avoid circular imports."""
    if name == 'TenantAwareViewSet':
        from .viewsets import TenantAwareViewSet
        return TenantAwareViewSet
    elif name == 'TenantAwareReadOnlyViewSet':
        from .viewsets import TenantAwareReadOnlyViewSet
        return TenantAwareReadOnlyViewSet
    elif name == 'TenantAwareModelViewSet':
        from .viewsets import TenantAwareModelViewSet
        return TenantAwareModelViewSet
    elif name == 'BaseModelSerializer':
        from .serializers import BaseModelSerializer
        return BaseModelSerializer
    elif name == 'SanitizedModelSerializer':
        from .serializers import SanitizedModelSerializer
        return SanitizedModelSerializer
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")


__all__ = [
    # Middleware
    'TenantContext',
    'TenantMiddleware',
    'RequestSigningMiddleware',
    'TenantRateThrottleMiddleware',
    'require_tenant_context',
    'TenantCacheMixin',
    'ContentSecurityPolicyMiddleware',
    'SQLInjectionProtectionMiddleware',
    'CommandInjectionProtectionMiddleware',
    'ClickjackingProtectionMiddleware',
    'HSTSMiddleware',
    
    # Permissions
    'Role',
    'Permission',
    'PermissionChecker',
    'TenantPermission',
    'RoleBasedPermission',
    'ABACPermission',
    'ObjectPermission',
    'require_permission',
    'require_abac',
    'AuthorizationLogger',
    
    # Cryptography
    'CryptographicError',
    'EncryptedData',
    'SecureKeyDerivation',
    'AESEncryption',
    'ChaChaEncryption',
    'RSAEncryption',
    'SecureFernet',
    'DataEncryptionService',
    'HashingService',
    'SecureTokenGenerator',
    'get_encryption_service',
    
    # Models
    'APIKey',
    
    # Advanced Authentication (lazy loaded)
    'DeviceFingerprint',
    'RequestSignatureValidator',
    'APIKeyAuthentication',
    'SignedRequestAuthentication',
    'TenantAPIKeyPermission',
    'MultiFactorAuthenticationPermission',
    'generate_jti',
    'get_token_metadata',
    
    # Exceptions (lazy loaded)
    'custom_exception_handler',
    'RateLimitExceeded',
    'InvalidAPIKey',
    'DeviceNotRecognized',
    'TokenRevoked',
    
    # Validators
    'SSRFProtectedURLValidator',
    'validate_ssrf_url',
    'StrongPasswordValidator',
    'InputSanitizer',
    'sanitize_input',
    'sanitize_request_data',
    'FileUploadValidator',
    'validate_file_upload',
    'SanitizedSerializerMixin',
    
    # Audit Logger
    'AuditLogger',
    'audit_log',
    'AuditLogMixin',
    
    # Base ViewSets
    'TenantAwareViewSet',
    'TenantAwareReadOnlyViewSet',
    'TenantAwareModelViewSet',
]
