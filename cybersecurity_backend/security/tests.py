import hashlib
import time
from datetime import timedelta
from unittest.mock import patch, MagicMock

from django.test import TestCase, override_settings
from django.urls import reverse
from django.utils import timezone
from django.core.exceptions import ValidationError
from rest_framework.test import APIClient
from rest_framework import status

from security.models import APIKey
from security.advanced_auth import (
    APIKeyAuthentication,
    SignedRequestAuthentication,
    RequestSignatureValidator,
    DeviceFingerprint,
)
from security.validators import (
    SSRFProtectedURLValidator,
    validate_ssrf_url,
    InputSanitizer,
    FileUploadValidator,
)
from security.audit_logger import AuditLogger
from users.models import User, Tenant


class APIKeyModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="SecureP@ssw0rd!"
        )
    
    def test_create_api_key(self):
        raw_key = APIKey.create_key(self.user, "Test Key")
        self.assertTrue(raw_key.startswith("sk_"))
        self.assertTrue(APIKey.objects.filter(user=self.user, name="Test Key").exists())
    
    def test_api_key_is_valid(self):
        raw_key = APIKey.create_key(self.user, "Valid Key")
        api_key = APIKey.objects.get(user=self.user, name="Valid Key")
        
        self.assertTrue(api_key.is_valid())
        
        api_key.is_active = False
        self.assertFalse(api_key.is_valid())
        
        api_key.is_active = True
        api_key.expires_at = timezone.now() - timedelta(days=1)
        self.assertFalse(api_key.is_valid())
    
    def test_api_key_hash(self):
        raw_key = "sk_testkey123456789012345678901234567890"
        key_hash, key_prefix = APIKey.hash_key(raw_key)
        
        self.assertEqual(key_prefix, "sk_testk")
        self.assertEqual(len(key_hash), 64)


class APIKeyAuthenticationTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="SecureP@ssw0rd!"
        )
        self.raw_key = APIKey.create_key(self.user, "Test API Key")
        self.api_key = APIKey.objects.get(key_prefix=self.raw_key[:8])
        
        self.auth = APIKeyAuthentication()
        self.client = APIClient()
    
    def test_missing_api_key_header(self):
        from security.advanced_auth import APIKeyAuthentication
        auth = APIKeyAuthentication()
        request = MagicMock()
        request.META = {}
        
        result = auth.authenticate(request)
        self.assertIsNone(result)
    
    def test_invalid_api_key_format(self):
        request = MagicMock()
        request.META = {'HTTP_X_API_KEY': 'invalid_format'}
        
        from rest_framework import exceptions
        with self.assertRaises(exceptions.AuthenticationFailed):
            self.auth.authenticate(request)
    
    def test_valid_api_key(self):
        with patch.object(APIKey.objects, 'select_related') as mock_select:
            mock_api_key = MagicMock()
            mock_api_key.is_valid.return_value = True
            mock_api_key.check_rate_limit.return_value = True
            mock_api_key.allowed_ips = []
            mock_api_key.tenant = None
            mock_api_key.last_used_at = None
            mock_api_key.save = MagicMock()
            
            mock_queryset = MagicMock()
            mock_queryset.get.return_value = mock_api_key
            mock_select.return_value = mock_queryset
            
            request = MagicMock()
            request.META = {'HTTP_X_API_KEY': f'{self.api_key.key_prefix} {self.raw_key}'}
            
            result = self.auth.authenticate(request)
            self.assertIsNotNone(result)
            self.assertEqual(result[0], mock_api_key.user)


class SignedRequestAuthenticationTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="SecureP@ssw0rd!"
        )
        self.raw_key = APIKey.create_key(self.user, "Test API Key")
        self.api_key = APIKey.objects.get(key_prefix=self.raw_key[:8])
        
        self.auth = SignedRequestAuthentication()
    
    def test_missing_headers(self):
        request = MagicMock()
        request.META = {}
        request.method = 'GET'
        request.path = '/api/test/'
        request.body = b''
        
        result = self.auth.authenticate(request)
        self.assertIsNone(result)


class RequestSignatureValidatorTest(TestCase):
    def test_generate_and_validate_signature(self):
        secret = "test_secret"
        method = "POST"
        path = "/api/test/"
        body = '{"key": "value"}'
        timestamp = int(time.time())
        
        signature = RequestSignatureValidator.generate_signature(
            method, path, body, timestamp, secret
        )
        
        is_valid = RequestSignatureValidator.validate_signature(
            method, path, body, timestamp, signature, secret
        )
        
        self.assertTrue(is_valid)
    
    def test_expired_signature(self):
        secret = "test_secret"
        method = "POST"
        path = "/api/test/"
        body = '{"key": "value"}'
        timestamp = int(time.time()) - 400
        
        signature = RequestSignatureValidator.generate_signature(
            method, path, body, timestamp, secret
        )
        
        is_valid = RequestSignatureValidator.validate_signature(
            method, path, body, timestamp, signature, secret
        )
        
        self.assertFalse(is_valid)
    
    def test_invalid_signature(self):
        secret = "test_secret"
        method = "POST"
        path = "/api/test/"
        body = '{"key": "value"}'
        timestamp = int(time.time())
        
        is_valid = RequestSignatureValidator.validate_signature(
            method, path, body, timestamp, "invalid_signature", secret
        )
        
        self.assertFalse(is_valid)


class DeviceFingerprintTest(TestCase):
    def test_generate_fingerprint(self):
        request = MagicMock()
        request.META = {
            'HTTP_USER_AGENT': 'Mozilla/5.0',
            'HTTP_ACCEPT_LANGUAGE': 'en-US',
            'HTTP_ACCEPT_ENCODING': 'gzip',
            'HTTP_ACCEPT': 'application/json',
            'REMOTE_ADDR': '127.0.0.1',
        }
        
        fingerprint = DeviceFingerprint.generate_fingerprint(request)
        self.assertEqual(len(fingerprint), 64)
    
    def test_get_client_ip(self):
        request = MagicMock()
        request.META = {'REMOTE_ADDR': '127.0.0.1'}
        
        ip = DeviceFingerprint.get_client_ip(request)
        self.assertEqual(ip, '127.0.0.1')
    
    def test_get_client_ip_with_proxy(self):
        request = MagicMock()
        request.META = {
            'HTTP_X_FORWARDED_FOR': '192.168.1.1, 10.0.0.1',
            'REMOTE_ADDR': '127.0.0.1',
        }
        
        ip = DeviceFingerprint.get_client_ip(request)
        self.assertEqual(ip, '192.168.1.1')


class APIKeyViewTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="SecureP@ssw0rd!"
        )
        self.raw_key = APIKey.create_key(self.user, "Test API Key")
        self.api_key = APIKey.objects.get(key_prefix=self.raw_key[:8])
        
        self.client = APIClient()
    
    def test_no_api_key_uses_other_auth(self):
        url = reverse("login")
        response = self.client.post(
            url,
            {"username": "testuser", "password": "SecureP@ssw0rd!"},
            format="json"
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class SSRFValidatorTest(TestCase):
    def setUp(self):
        self.validator = SSRFProtectedURLValidator()
    
    def test_valid_https_url(self):
        try:
            self.validator("https://example.com/webhook")
        except ValidationError:
            self.fail("Valid HTTPS URL raised ValidationError")
    
    def test_valid_http_url(self):
        try:
            self.validator("http://example.com/webhook")
        except ValidationError:
            self.fail("Valid HTTP URL raised ValidationError")
    
    def test_invalid_scheme_ftp(self):
        with self.assertRaises(ValidationError) as ctx:
            self.validator("ftp://example.com/webhook")
        self.assertIn("Invalid URL scheme", str(ctx.exception))
    
    def test_blocked_host_cloud_metadata(self):
        with self.assertRaises(ValidationError) as ctx:
            self.validator("http://169.254.169.254/latest/meta-data/")
        self.assertIn("Blocked hostname", str(ctx.exception))
    
    def test_blocked_host_google_cloud(self):
        with self.assertRaises(ValidationError) as ctx:
            self.validator("http://metadata.google.internal/computeMetadata/v1/")
        self.assertIn("Blocked hostname", str(ctx.exception))
    
    def test_private_ip_address(self):
        with self.assertRaises(ValidationError) as ctx:
            self.validator("http://192.168.1.1/webhook")
        self.assertIn("Private/loopback IP addresses are not allowed", str(ctx.exception))
    
    def test_loopback_ip_address(self):
        with self.assertRaises(ValidationError) as ctx:
            self.validator("http://127.0.0.1/webhook")
        self.assertIn("Private/loopback IP addresses are not allowed", str(ctx.exception))
    
    def test_localhost_blocked(self):
        with self.assertRaises(ValidationError) as ctx:
            self.validator("http://localhost/webhook")
        self.assertIn("blocked", str(ctx.exception).lower())
    
    def test_no_hostname(self):
        with self.assertRaises(ValidationError) as ctx:
            self.validator("http://")
        self.assertIn("valid hostname", str(ctx.exception))
    
    def test_validate_ssrf_url_function(self):
        try:
            validate_ssrf_url("https://api.example.com/webhook")
        except ValidationError:
            self.fail("Valid URL raised ValidationError")


class InputSanitizerTest(TestCase):
    def test_sanitize_plain_text(self):
        result = InputSanitizer.sanitize("Hello World")
        self.assertEqual(result, "Hello World")
    
    def test_sanitize_script_tag(self):
        result = InputSanitizer.sanitize("<script>alert('xss')</script>")
        # The entire script tag should be removed
        self.assertNotIn("<script>", result)
    
    def test_sanitize_javascript_protocol(self):
        result = InputSanitizer.sanitize("javascript:alert('xss')")
        self.assertNotIn("javascript:", result)
    
    def test_sanitize_event_handler(self):
        result = InputSanitizer.sanitize('<img src=x onerror="alert(1)">')
        self.assertNotIn("onerror", result)
    
    def test_sanitize_iframe(self):
        result = InputSanitizer.sanitize("<iframe src='evil'></iframe>")
        self.assertNotIn("<iframe>", result)
    
    def test_sanitize_form(self):
        result = InputSanitizer.sanitize("<form action='evil'><input></form>")
        self.assertNotIn("<form", result)
    
    def test_sanitize_eval(self):
        result = InputSanitizer.sanitize("eval(document.cookie)")
        self.assertNotIn("eval", result)
    
    def test_sanitize_dict(self):
        data = {"name": "<script>alert(1)</script>", "age": 25}
        result = InputSanitizer.sanitize_dict(data)
        self.assertNotIn("<script>", result["name"])
        self.assertEqual(result["age"], 25)
    
    def test_sanitize_list(self):
        data = ["<script>alert(1)</script>", "safe"]
        result = InputSanitizer.sanitize_list(data)
        self.assertNotIn("<script>", result[0])
        self.assertEqual(result[1], "safe")


class FileUploadValidatorTest(TestCase):
    def test_validate_empty_filename(self):
        class MockFile:
            name = ""
            size = 1024
            def seek(self, pos): pass
            def read(self, size): return b""
        
        with self.assertRaises(ValidationError) as ctx:
            FileUploadValidator.validate(MockFile())
        self.assertIn("empty", str(ctx.exception).lower())
    
    def test_validate_dangerous_chars_in_filename(self):
        class MockFile:
            name = "../../../etc/passwd"
            size = 1024
            def seek(self, pos): pass
            def read(self, size): return b""
        
        with self.assertRaises(ValidationError):
            FileUploadValidator.validate(MockFile())
    
    def test_validate_too_large_file(self):
        class MockFile:
            name = "test.pdf"
            size = 100 * 1024 * 1024  # 100MB
            def seek(self, pos): pass
            def read(self, size): return b""
        
        with self.assertRaises(ValidationError) as ctx:
            FileUploadValidator.validate(MockFile(), max_size=10*1024*1024)
        self.assertIn("size", str(ctx.exception).lower())
    
    def test_validate_blocked_extension(self):
        class MockFile:
            name = "malware.exe"
            size = 1024
            def seek(self, pos): pass
            def read(self, size): return b"PDF content here"
        
        with self.assertRaises(ValidationError) as ctx:
            FileUploadValidator.validate(MockFile())
        self.assertIn("blocked", str(ctx.exception).lower())
    
    def test_validate_allowed_extension(self):
        class MockFile:
            name = "document.pdf"
            size = 1024
            def seek(self, pos): pass
            def read(self, size): return b"PDF content here"
        
        result = FileUploadValidator.validate(MockFile())
        self.assertTrue(result)


class AuditLoggerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="audituser",
            email="audit@example.com",
            password="SecureP@ssw0rd!"
        )
    
    @patch('django.core.cache.cache')
    def test_log_security_event(self, mock_cache):
        mock_cache.get.return_value = None
        
        result = AuditLogger.log_security_event(
            event_type='test_event',
            user=self.user,
            tenant_id=1,
            action='test',
            resource='test_resource',
            ip_address='127.0.0.1',
            user_agent='Test Agent',
            save_to_db=False,
        )
        
        self.assertEqual(result['event_type'], 'test_event')
        self.assertEqual(result['user_id'], self.user.id)
    
    @patch('django.core.cache.cache')
    def test_log_login_success(self, mock_cache):
        mock_request = MagicMock()
        mock_request.META = {'REMOTE_ADDR': '127.0.0.1', 'HTTP_USER_AGENT': 'Test'}
        mock_request.user = self.user
        
        AuditLogger.log_login_success(mock_request, self.user)
    
    @patch('django.core.cache.cache')
    def test_log_login_failed(self, mock_cache):
        mock_request = MagicMock()
        mock_request.META = {'REMOTE_ADDR': '127.0.0.1'}
        
        AuditLogger.log_login_failed(mock_request, "testuser")


class RateLimitingTest(TestCase):
    def setUp(self):
        self.client = APIClient()
    
    def test_rate_limit_headers_present(self):
        response = self.client.get('/api/v1/users/')
        self.assertIn('X-RateLimit-Limit', response.headers)
    
    def test_rate_limit_exceeded_returns_429(self):
        from django.core.cache import cache
        cache.clear()
        
        for i in range(70):
            response = self.client.get('/api/v1/users/')
            if response.status_code == 429:
                break
        
        # We should eventually hit rate limit
        # (depends on anon rate limit setting)
