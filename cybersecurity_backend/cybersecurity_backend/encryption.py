"""
Legacy encryption module - redirects to security.crypto
This module is deprecated. Please use security.crypto instead.
"""
from security.crypto import (
    DataEncryptionService,
    get_encryption_service,
    CryptographicError,
    SecureTokenGenerator,
    HashingService,
)

__all__ = [
    'DataEncryptionService',
    'get_encryption_service',
    'CryptographicError',
    'encryption_service',
    'SecureTokenGenerator',
    'HashingService',
]

encryption_service = get_encryption_service()
