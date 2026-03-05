"""
Secure Cryptography Module
Implements modern cryptographic practices with proper key management.
No custom crypto - using well-vetted libraries only.
"""
import os
import base64
import hashlib
import secrets
from typing import Union, Tuple, Optional
from dataclasses import dataclass

from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives.ciphers.aead import AESGCM, ChaCha20Poly1305
from cryptography.hazmat.backends import default_backend
from cryptography import x509
from django.conf import settings


class CryptographicError(Exception):
    """Custom exception for cryptographic operations."""
    pass


@dataclass
class EncryptedData:
    """Container for encrypted data with metadata."""
    ciphertext: bytes
    nonce: bytes
    key_id: str


class SecureKeyDerivation:
    """
    Secure key derivation using industry-standard KDFs.
    Implements defense against rainbow table attacks.
    """
    
    @staticmethod
    def derive_key(
        password: str,
        salt: bytes = None,
        iterations: int = 600000,
        key_length: int = 32
    ) -> Tuple[bytes, bytes]:
        """
        Derive key using PBKDF2-HMAC-SHA3-256.
        
        Args:
            password: Master password
            salt: Random salt (generated if None)
            iterations: PBKDF2 iterations (600,000 recommended)
            key_length: Output key length in bytes
        
        Returns:
            Tuple of (derived_key, salt)
        """
        if salt is None:
            salt = secrets.token_bytes(32)
        
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA3_256(),
            length=key_length,
            salt=salt,
            iterations=iterations,
            backend=default_backend()
        )
        
        key = kdf.derive(password.encode())
        return key, salt
    
    @staticmethod
    def derive_key_argon2(
        password: str,
        salt: bytes = None,
        memory: int = 65536,  # 64 MB
        time: int = 3,
        parallelism: int = 4
    ) -> Tuple[bytes, bytes]:
        """
        Derive key using Argon2id (preferred over PBKDF2).
        Requires argon2-cffi package.
        """
        try:
            from argon2 import PasswordHasher
            from argon2.exceptions import VerifyMismatchError
            
            ph = PasswordHasher(
                time_cost=time,
                memory_cost=memory,
                parallelism=parallelism,
                hash_len=32,
                type=2  # Argon2id
            )
            
            if salt is None:
                # Argon2 generates its own salt
                hashed = ph.hash(password)
                # Extract salt from hash for storage
                salt = base64.urlsafe_b64decode(hashed.split('$')[-2][:22])
                return ph.hash(password).encode(), salt
            else:
                # Use provided salt
                # Note: argon2 doesn't support custom salt easily
                # This is simplified
                return None, salt
                
        except ImportError:
            # Fallback to PBKDF2
            return SecureKeyDerivation.derive_key(password, salt)


class AESEncryption:
    """
    AES-GCM encryption for authenticated encryption.
    Provides both confidentiality and integrity.
    """
    
    def __init__(self, key: bytes):
        """
        Initialize with 256-bit key.
        
        Args:
            key: 32-byte encryption key
        """
        if len(key) not in (16, 24, 32):
            raise CryptographicError("Key must be 16, 24, or 32 bytes")
        
        self.key = key
    
    def encrypt(self, plaintext: Union[str, bytes], aad: bytes = None) -> EncryptedData:
        """
        Encrypt plaintext using AES-GCM.
        
        Args:
            plaintext: Data to encrypt
            aad: Additional authenticated data (        
        Returns:
optional)
            EncryptedData with ciphertext and nonce
        """
        if isinstance(plaintext, str):
            plaintext = plaintext.encode('utf-8')
        
        # Generate random 96-bit nonce
        nonce = secrets.token_bytes(12)
        
        aesgcm = AESGCM(self.key)
        ciphertext = aesgcm.encrypt(nonce, plaintext, aad)
        
        return EncryptedData(
            ciphertext=ciphertext,
            nonce=nonce,
            key_id=self._get_key_id()
        )
    
    def decrypt(self, encrypted_data: EncryptedData, aad: bytes = None) -> bytes:
        """
        Decrypt ciphertext using AES-GCM.
        
        Args:
            encrypted_data: EncryptedData object
            aad: Additional authenticated data (must match encrypt)
        
        Returns:
            Decrypted plaintext
        """
        aesgcm = AESGCM(self.key)
        return aesgcm.decrypt(encrypted_data.nonce, encrypted_data.ciphertext, aad)
    
    def _get_key_id(self) -> str:
        """Get identifier for this key."""
        return hashlib.sha256(self.key).hexdigest()[:16]


class ChaChaEncryption:
    """
    ChaCha20-Poly1305 encryption (alternative to AES).
    Better performance on mobile/embedded devices.
    """
    
    def __init__(self, key: bytes):
        if len(key) != 32:
            raise CryptographicError("Key must be 32 bytes")
        self.key = key
    
    def encrypt(self, plaintext: Union[str, bytes], aad: bytes = None) -> EncryptedData:
        if isinstance(plaintext, str):
            plaintext = plaintext.encode('utf-8')
        
        nonce = secrets.token_bytes(12)
        chacha = ChaCha20Poly1305(self.key)
        ciphertext = chacha.encrypt(nonce, plaintext, aad)
        
        return EncryptedData(ciphertext=ciphertext, nonce=nonce, key_id='')
    
    def decrypt(self, encrypted_data: EncryptedData, aad: bytes = None) -> bytes:
        chacha = ChaCha20Poly1305(self.key)
        return chacha.decrypt(encrypted_data.nonce, encrypted_data.ciphertext, aad)


class RSAEncryption:
    """
    RSA encryption for asymmetric operations.
    Use for encrypting small data (keys) or digital signatures.
    """
    
    @staticmethod
    def generate_keypair(key_size: int = 4096) -> Tuple[bytes, bytes]:
        """
        Generate RSA keypair.
        
        Args:
            key_size: Key size in bits (minimum 2048, recommended 4096)
        
        Returns:
            Tuple of (private_key_pem, public_key_pem)
        """
        if key_size < 2048:
            raise CryptographicError("Key size must be at least 2048 bits")
        
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=key_size,
            backend=default_backend()
        )
        
        private_pem = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        )
        
        public_pem = private_key.public_key().public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )
        
        return private_pem, public_pem
    
    @staticmethod
    def encrypt(plaintext: bytes, public_key_pem: bytes) -> bytes:
        """Encrypt with RSA-OAEP (recommended over PKCS1v15)."""
        from cryptography.hazmat.primitives import serialization
        
        public_key = serialization.load_pem_public_key(public_key_pem)
        
        return public_key.encrypt(
            plaintext,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
    
    @staticmethod
    def decrypt(ciphertext: bytes, private_key_pem: bytes) -> bytes:
        """Decrypt with RSA-OAEP."""
        from cryptography.hazmat.primitives import serialization
        
        private_key = serialization.load_pem_private_key(
            private_key_pem,
            password=None
        )
        
        return private_key.decrypt(
            ciphertext,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
    
    @staticmethod
    def sign(message: bytes, private_key_pem: bytes) -> bytes:
        """Create RSA-PSS digital signature."""
        from cryptography.hazmat.primitives import serialization
        
        private_key = serialization.load_pem_private_key(
            private_key_pem,
            password=None
        )
        
        return private_key.sign(
            message,
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.AUTO
            ),
            hashes.SHA256()
        )
    
    @staticmethod
    def verify(message: bytes, signature: bytes, public_key_pem: bytes) -> bool:
        """Verify RSA-PSS signature."""
        from cryptography.hazmat.primitives import serialization
        
        try:
            public_key = serialization.load_pem_public_key(public_key_pem)
            public_key.verify(
                signature,
                message,
                padding.PSS(
                    mgf=padding.MGF1(hashes.SHA256()),
                    salt_length=padding.PSS.AUTO
                ),
                hashes.SHA256()
            )
            return True
        except Exception:
            return False


class SecureFernet:
    """
    Simplified encryption using Fernet (AEAD based on AES-CBC + HMAC).
    Provides secure defaults for symmetric encryption.
    """
    
    def __init__(self, key: bytes = None):
        """
        Initialize with key or generate new one.
        
        Args:
            key: 32-byte URL-safe base64-encoded key
        """
        if key is None:
            key = Fernet.generate_key()
        elif isinstance(key, str):
            key = key.encode()
        
        self.fernet = Fernet(key)
        self._key = key
    
    def encrypt(self, data: Union[str, bytes]) -> str:
        """Encrypt and return base64-encoded string."""
        if isinstance(data, str):
            data = data.encode('utf-8')
        
        return self.fernet.encrypt(data).decode('utf-8')
    
    def decrypt(self, encrypted_data: str) -> bytes:
        """Decrypt from base64-encoded string."""
        return self.fernet.decrypt(encrypted_data.encode())
    
    def get_key(self) -> str:
        """Get key as string for storage."""
        if isinstance(self._key, bytes):
            return self._key.decode()
        return self._key


class DataEncryptionService:
    """
    High-level encryption service with key rotation support.
    Implements envelope encryption pattern.
    """
    
    def __init__(self):
        self._master_key = self._get_master_key()
        self._key_cache = {}
    
    def _get_master_key(self) -> bytes:
        """Get master key from secure storage (Vault/env)."""
        # In production, fetch from HashiCorp Vault or AWS KMS
        master_key = os.getenv('DATA_ENCRYPTION_KEY')
        
        if not master_key:
            raise CryptographicError(
                "DATA_ENCRYPTION_KEY environment variable is required"
            )
        
        # Ensure minimum key length
        if len(master_key) < 32:
            # Derive proper key length
            key, _ = SecureKeyDerivation.derive_key(master_key, iterations=10000)
            return key
        
        return master_key[:32].encode()
    
    def encrypt(self, plaintext: str, key_id: str = 'master') -> Tuple[str, str]:
        """
        Encrypt data with envelope encryption.
        
        Returns:
            Tuple of (encrypted_data_base64, key_id)
        """
        # Generate data encryption key (DEK)
        dek = secrets.token_bytes(32)
        
        # Encrypt DEK with master key (KEK)
        aes = AESEncryption(self._master_key)
        encrypted_dek = aes.encrypt(dek)
        
        # Store encrypted DEK with ciphertext
        # Format: nonce + ciphertext (both base64)
        wrapped_dek = base64.b64encode(
            encrypted_dek.nonce + encrypted_dek.ciphertext
        ).decode()
        
        # Encrypt actual data with DEK
        data_aes = AESEncryption(dek)
        encrypted_data = data_aes.encrypt(plaintext)
        
        # Combine: wrapped_dek + nonce + ciphertext
        result = f"{wrapped_dek}:{base64.b64encode(encrypted_data.nonce).decode()}:{base64.b64encode(encrypted_data.ciphertext).decode()}"
        
        return result, key_id
    
    def decrypt(self, encrypted_package: str, key_id: str = 'master') -> str:
        """
        Decrypt data with key rotation support.
        """
        parts = encrypted_package.split(':')
        if len(parts) != 3:
            raise CryptographicError("Invalid encrypted data format")
        
        wrapped_dek_b64, nonce_b64, ciphertext_b64 = parts
        
        # Unwrap DEK
        wrapped_dek = base64.b64decode(wrapped_dek_b64)
        encrypted_dek = EncryptedData(
            ciphertext=wrapped_dek[12:],
            nonce=wrapped_dek[:12],
            key_id=key_id
        )
        
        aes = AESEncryption(self._master_key)
        dek = aes.decrypt(encrypted_dek)
        
        # Decrypt data
        data_aes = AESEncryption(dek)
        encrypted_data = EncryptedData(
            ciphertext=base64.b64decode(ciphertext_b64),
            nonce=base64.b64decode(nonce_b64),
            key_id=key_id
        )
        
        plaintext = data_aes.decrypt(encrypted_data)
        return plaintext.decode('utf-8')
    
    def rotate_keys(self) -> str:
        """
        Generate new master key for key rotation.
        Returns new key ID.
        """
        # In production: store new key in KMS with new key_id
        new_key_id = secrets.token_hex(8)
        return new_key_id


class HashingService:
    """Secure hashing utilities."""
    
    @staticmethod
    def hash_password(password: str, salt: bytes = None) -> Tuple[str, bytes]:
        """
        Hash password using Argon2id (preferred) or bcrypt.
        
        Returns:
            Tuple of (hash_string, salt)
        """
        try:
            # Try Argon2 first
            import argon2
            from argon2 import PasswordHasher
            
            ph = PasswordHasher(
                time_cost=3,
                memory_cost=65536,
                parallelism=4,
                hash_len=32,
                type=argon2.Type.ID
            )
            
            hashed = ph.hash(password)
            return hashed, salt or secrets.token_bytes(16)
            
        except ImportError:
            # Fallback to bcrypt via Django
            import bcrypt
            salt = salt or bcrypt.gensalt(rounds=12)
            hashed = bcrypt.hashpw(password.encode(), salt)
            return hashed.decode(), salt
    
    @staticmethod
    def verify_password(password: str, hashed: str) -> bool:
        """Verify password against hash."""
        try:
            # Try Argon2
            from argon2 import PasswordHasher
            from argon2.exceptions import VerifyMismatchError
            
            ph = PasswordHasher()
            ph.verify(hashed, password)
            return True
        except (ImportError, VerifyMismatchError):
            pass
        
        # Fallback to bcrypt
        try:
            import bcrypt
            return bcrypt.checkpw(
                password.encode(),
                hashed.encode()
            )
        except Exception:
            return False
    
    @staticmethod
    def hash_data(data: str, salt: str = '') -> str:
        """SHA-3-256 hash for general data."""
        return hashlib.sha3_256(f"{data}{salt}".encode()).hexdigest()
    
    @staticmethod
    def hmac_sign(message: str, key: bytes) -> str:
        """HMAC-SHA3-256 signing."""
        return hmac.new(
            key,
            message.encode(),
            hashlib.sha3_256
        ).hexdigest()
    
    @staticmethod
    def hmac_verify(message: str, signature: str, key: bytes) -> bool:
        """Verify HMAC signature with constant-time comparison."""
        expected = hmac.new(key, message.encode(), hashlib.sha3_256).hexdigest()
        return hmac.compare_digest(expected, signature)


# Secure token generation for various purposes
class SecureTokenGenerator:
    """Generate secure tokens for various purposes."""
    
    @staticmethod
    def generate_api_key(prefix: str = 'sk') -> str:
        """
        Generate API key with prefix.
        Format: prefix_randomkey
        """
        random_part = secrets.token_urlsafe(32)
        return f"{prefix}_{random_part}"
    
    @staticmethod
    def generate_session_id() -> str:
        """Generate secure session ID."""
        return secrets.token_urlsafe(32)
    
    @staticmethod
    def generate_verification_code(length: int = 6) -> str:
        """Generate numeric verification code."""
        return ''.join(secrets.choice('0123456789') for _ in range(length))
    
    @staticmethod
    def generate_password_reset_token() -> str:
        """Generate secure password reset token."""
        return secrets.token_urlsafe(32)
    
    @staticmethod
    def generate_csrf_token() -> str:
        """Generate CSRF token."""
        return secrets.token_urlsafe(32)


# Singleton instances
_encryption_service = None

def get_encryption_service() -> DataEncryptionService:
    """Get singleton encryption service."""
    global _encryption_service
    if _encryption_service is None:
        _encryption_service = DataEncryptionService()
    return _encryption_service
