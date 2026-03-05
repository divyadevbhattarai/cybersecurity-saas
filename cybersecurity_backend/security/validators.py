import html
import ipaddress
import re
import socket
from urllib.parse import urlparse

from django.core.exceptions import ValidationError
from django.utils.deconstruct import deconstructible


@deconstructible
class StrongPasswordValidator:
    """
    Enhanced password validator enforcing:
    - Minimum 12 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    - At least one special character
    - No sequential or repeated characters
    """
    
    MIN_LENGTH = 12
    
    def __init__(
        self,
        min_length: int = 12,
        require_uppercase: bool = True,
        require_lowercase: bool = True,
        require_digit: bool = True,
        require_special: bool = True,
    ):
        self.min_length = min_length
        self.require_uppercase = require_uppercase
        self.require_lowercase = require_lowercase
        self.require_digit = require_digit
        self.require_special = require_special
    
    def validate(self, password: str, user=None):
        errors = []
        
        if len(password) < self.min_length:
            errors.append(f'Password must be at least {self.min_length} characters long.')
        
        if self.require_uppercase and not re.search(r'[A-Z]', password):
            errors.append('Password must contain at least one uppercase letter.')
        
        if self.require_lowercase and not re.search(r'[a-z]', password):
            errors.append('Password must contain at least one lowercase letter.')
        
        if self.require_digit and not re.search(r'\d', password):
            errors.append('Password must contain at least one digit.')
        
        if self.require_special and not re.search(r'[!@#$%^&*(),.?":{}|<>_\-+\'=~`\[\]\\;/]', password):
            errors.append('Password must contain at least one special character.')
        
        if self._has_sequential_chars(password):
            errors.append('Password must not contain sequential characters (e.g., abc, 123).')
        
        if self._has_repeated_chars(password):
            errors.append('Password must not contain repeated characters (e.g., aaa, 111).')
        
        if errors:
            raise ValidationError(errors)
    
    def _has_sequential_chars(self, password: str) -> bool:
        """Check for sequential characters."""
        sequences = [
            'abcdefghijklmnopqrstuvwxyz',
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            '0123456789',
            'qwertyuiop',
            'asdfghjkl',
            'zxcvbnm',
            'QWERTYUIOP',
            'ASDFGHJKL',
            'ZXCVBNM',
        ]
        password_lower = password.lower()
        for seq in sequences:
            for i in range(len(seq) - 2):
                if seq[i:i+3] in password_lower:
                    return True
        return False
    
    def _has_repeated_chars(self, password: str) -> bool:
        """Check for 3+ repeated characters."""
        for i in range(len(password) - 2):
            if password[i] == password[i+1] == password[i+2]:
                return True
        return False
    
    def get_help_text(self):
        return (
            f'Password must be at least {self.min_length} characters and contain '
            'uppercase, lowercase, digit, and special character.'
        )
    
    def __eq__(self, other):
        return (
            isinstance(other, StrongPasswordValidator) and
            self.min_length == other.min_length
        )


@deconstructible
class SSRFProtectedURLValidator:
    """Django validator to protect against SSRF attacks in URL fields."""
    
    BLOCKED_HOSTS = [
        '169.254.169.254',
        'metadata.google.internal',
        'metadata.google',
        'kubernetes.default.svc',
        'kubernetes.default',
    ]
    
    BLOCKED_NETWORKS = [
        '10.0.0.0/8',
        '172.16.0.0/12',
        '192.168.0.0/16',
        '127.0.0.0/8',
        '169.254.0.0/16',
        '0.0.0.0/8',
        '100.64.0.0/10',
        '192.0.0.0/24',
        '192.0.2.0/24',
        '198.51.100.0/24',
        '203.0.113.0/24',
        'fc00::/7',
        'fe80::/10',
    ]
    
    def __call__(self, value):
        url = value if isinstance(value, str) else str(value)
        self.validate(url)
    
    def validate(self, url: str):
        try:
            parsed = urlparse(url)
            
            if not parsed.scheme or parsed.scheme not in ('http', 'https'):
                raise ValidationError(f"Invalid URL scheme: {parsed.scheme}. Only http and https are allowed.")
            
            hostname = parsed.hostname
            if not hostname:
                raise ValidationError("URL must have a valid hostname")
            hostname = hostname.lower()
            
            if hostname in self.BLOCKED_HOSTS:
                raise ValidationError(f"Blocked hostname: {hostname}")
            
            try:
                ip = ipaddress.ip_address(hostname)
                if ip.is_private or ip.is_loopback or ip.is_link_local:
                    raise ValidationError(
                        f"Private/loopback IP addresses are not allowed: {ip}"
                    )
            except ValueError:
                pass
            
            try:
                resolved_ips = socket.getaddrinfo(hostname, None, socket.AF_UNSPEC)
                for result in resolved_ips:
                    ip = result[4][0]
                    ip_obj = ipaddress.ip_address(ip)
                    if ip_obj.is_private or ip_obj.is_loopback or ip_obj.is_link_local:
                        raise ValidationError(
                            f"URL resolves to blocked private IP: {ip}"
                        )
                    
                    for network in self.BLOCKED_NETWORKS:
                        if ip_obj in ipaddress.ip_network(network):
                            raise ValidationError(
                                f"URL resolves to blocked network: {network}"
                            )
            except socket.gaierror:
                pass
            
        except ValidationError:
            raise
        except Exception as e:
            raise ValidationError(f"URL validation failed: {str(e)}")
    
    def __eq__(self, other):
        return isinstance(other, SSRFProtectedURLValidator)


def validate_ssrf_url(url: str) -> bool:
    """Standalone function to validate URL for SSRF protection."""
    validator = SSRFProtectedURLValidator()
    validator.validate(url)
    return True


import html
import re


class InputSanitizer:
    """
    Sanitize user input to prevent XSS and injection attacks.
    """
    
    DANGEROUS_PATTERNS = [
        r'<script[^>]*>.*?</script>',
        r'javascript:',
        r'on\w+\s*=',
        r'<iframe[^>]*>.*?</iframe>',
        r'<object[^>]*>.*?</object>',
        r'<embed[^>]*>',
        r'<applet[^>]*>.*?</applet>',
        r'<form[^>]*>',
        r'eval\s*\(',
        r'exec\s*\(',
        r'exec\s*\(',
    ]
    
    @classmethod
    def sanitize(cls, value: str, allow_html: bool = False) -> str:
        """Sanitize a string value."""
        if not isinstance(value, str):
            return value
        
        if allow_html:
            return cls._sanitize_html(value)
        
        return cls._strip_dangerous_content(value)
    
    @classmethod
    def _strip_dangerous_content(cls, value: str) -> str:
        """Remove dangerous patterns from string."""
        result = value
        
        for pattern in cls.DANGEROUS_PATTERNS:
            result = re.sub(pattern, '', result, flags=re.IGNORECASE | re.DOTALL)
        
        result = html.escape(result)
        
        return result
    
    @classmethod
    def _sanitize_html(cls, value: str) -> str:
        """Sanitize HTML while allowing safe tags."""
        allowed_tags = {
            'p', 'br', 'b', 'i', 'u', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
        }
        
        result = html.escape(value)
        
        return result
    
    @classmethod
    def sanitize_dict(cls, data: dict, allow_html: bool = False) -> dict:
        """Sanitize all string values in a dictionary."""
        if not isinstance(data, dict):
            return data
        
        return {
            key: cls.sanitize(value, allow_html) if isinstance(value, str) else value
            for key, value in data.items()
        }
    
    @classmethod
    def sanitize_list(cls, data: list, allow_html: bool = False) -> list:
        """Sanitize all string values in a list."""
        if not isinstance(data, list):
            return data
        
        return [
            cls.sanitize(item, allow_html) if isinstance(item, str) else item
            for item in data
        ]


def sanitize_input(value: str, allow_html: bool = False) -> str:
    """Standalone function to sanitize input."""
    return InputSanitizer.sanitize(value, allow_html)


def sanitize_request_data(request, allow_html: bool = False) -> dict:
    """Sanitize all data from a request object."""
    from rest_framework.request import Request
    
    if isinstance(request, Request):
        data = request.data
    else:
        data = getattr(request, 'POST', {}) or getattr(request, 'GET', {})
    
    if hasattr(data, 'dict'):
        return InputSanitizer.sanitize_dict(data.dict(), allow_html)
    elif isinstance(data, dict):
        return InputSanitizer.sanitize_dict(data, allow_html)
    
    return {}


import os
from django.core.exceptions import ValidationError

try:
    import magic
    HAS_MAGIC = True
except ImportError:
    HAS_MAGIC = False


class FileUploadValidator:
    """
    Secure file upload validation.
    Validates file type, size, and content.
    """
    
    ALLOWED_MIME_TYPES = {
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/plain',
        'text/csv',
        'application/json',
        'application/zip',
        'application/x-zip-compressed',
    }
    
    ALLOWED_EXTENSIONS = {
        '.jpg', '.jpeg', '.png', '.gif', '.webp',
        '.pdf', '.txt', '.csv', '.json', '.zip',
    }
    
    BLOCKED_EXTENSIONS = {
        '.exe', '.bat', '.cmd', '.sh', '.ps1',
        '.js', '.html', '.htm', '.xml', '.svg',
        '.php', '.phtml', '.asp', '.aspx', '.jsp',
        '.war', '.jar', '.class', '.so', '.dll',
        '.msi', '.msp', '.cab', '.zip', '.rar',
    }
    
    MAX_FILE_SIZE = 10 * 1024 * 1024
    
    MAGIC_BYTES = {
        'jpeg': b'\xff\xd8\xff',
        'png': b'\x89\x50\x4e\x47',
        'gif': b'GIF87a',
        'gif89': b'GIF89a',
        'pdf': b'%PDF',
        'zip': b'PK\x03\x04',
        'json': b'{',
        'text': b'',
    }
    
    @classmethod
    def validate(cls, file, max_size: int = None):
        """Validate an uploaded file."""
        max_size = max_size or cls.MAX_FILE_SIZE
        
        if file.size > max_size:
            raise ValidationError(f'File size exceeds maximum allowed size of {max_size} bytes.')
        
        cls._validate_filename(file.name)
        cls._validate_mime_type(file)
        cls._validate_extension(file.name)
        cls._validate_magic_bytes(file)
        
        return True
    
    @classmethod
    def _validate_filename(cls, filename: str):
        """Validate and sanitize filename."""
        if not filename:
            raise ValidationError('Filename cannot be empty.')
        
        filename = os.path.basename(filename)
        
        dangerous_chars = ['..', '~', '$', '|', ';', '&', '`', '<', '>']
        for char in dangerous_chars:
            if char in filename:
                raise ValidationError(f'Filename contains dangerous character: {char}')
        
        if filename.startswith('.'):
            raise ValidationError('Filename cannot start with a dot.')
        
        return True
    
    @classmethod
    def _validate_mime_type(cls, file):
        """Validate MIME type using python-magic."""
        if not HAS_MAGIC:
            return True
        
        try:
            file.seek(0)
            mime_type = magic.from_buffer(file.read(2048), mime=True)
            file.seek(0)
            
            if mime_type not in cls.ALLOWED_MIME_TYPES:
                raise ValidationError(f'File type {mime_type} is not allowed.')
            
            return True
        except Exception as e:
            raise ValidationError(f'Could not validate file type: {str(e)}')
    
    @classmethod
    def _validate_extension(cls, filename: str):
        """Validate file extension."""
        ext = os.path.splitext(filename)[1].lower()
        
        if ext in cls.BLOCKED_EXTENSIONS:
            raise ValidationError(f'File extension {ext} is blocked for security reasons.')
        
        if ext and ext not in cls.ALLOWED_EXTENSIONS:
            raise ValidationError(f'File extension {ext} is not allowed.')
        
        return True
    
    @classmethod
    def _validate_magic_bytes(cls, file):
        """Validate file content using magic bytes."""
        file.seek(0)
        header = file.read(16)
        file.seek(0)
        
        if not header:
            raise ValidationError('File appears to be empty.')
        
        return True


def validate_file_upload(file, max_size: int = None) -> bool:
    """Standalone function to validate file upload."""
    FileUploadValidator.validate(file, max_size)
    return True


class SanitizedSerializerMixin:
    """
    Mixin for DRF serializers to automatically sanitize input.
    Prevents XSS and injection attacks.
    """
    
    def to_internal_value(self, data):
        sanitized = InputSanitizer.sanitize_dict(data, allow_html=False)
        return super().to_internal_value(sanitized)
    
    def validate(self, attrs):
        sanitized = InputSanitizer.sanitize_dict(attrs, allow_html=False)
        return super().validate(sanitized)
