import hmac
import hashlib
import time
import ipaddress
import socket
import requests
from urllib.parse import urlparse
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed, ValidationError


class SSRFProtection:
    """Protect against Server-Side Request Forgery attacks."""
    
    BLOCKED_HOSTS = [
        '169.254.169.254',  # Cloud metadata endpoints
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
    
    @classmethod
    def validate_url(cls, url: str) -> bool:
        """Validate URL to prevent SSRF attacks."""
        try:
            parsed = urlparse(url)
            
            if not parsed.scheme or parsed.scheme not in ('http', 'https'):
                raise ValidationError(f"Invalid URL scheme: {parsed.scheme}")
            
            hostname = parsed.hostname
            if not hostname:
                raise ValidationError("URL must have a valid hostname")
            hostname = hostname.lower()
            
            if hostname in cls.BLOCKED_HOSTS:
                raise ValidationError(f"Blocked hostname: {hostname}")
            
            try:
                ip = ipaddress.ip_address(hostname)
                if ip.is_private or ip.is_loopback or ip.is_link_local:
                    raise ValidationError(f"Private/loopback IP addresses are not allowed: {ip}")
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
                    
                    for network in cls.BLOCKED_NETWORKS:
                        if ip_obj in ipaddress.ip_network(network):
                            raise ValidationError(
                                f"URL resolves to blocked network: {network}"
                            )
            except socket.gaierror:
                pass
            
            return True
            
        except ValidationError:
            raise
        except Exception as e:
            raise ValidationError(f"URL validation failed: {str(e)}")


class WebhookSignatureVerifier:
    @staticmethod
    def generate_signature(payload, secret):
        return hmac.new(
            secret.encode('utf-8'),
            payload.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()

    @staticmethod
    def verify_signature(payload, signature, secret, tolerance=300):
        if not signature or not secret:
            raise AuthenticationFailed('Missing signature or secret')

        expected_signature = WebhookSignatureVerifier.generate_signature(payload, secret)
        
        if not hmac.compare_digest(expected_signature, signature):
            raise AuthenticationFailed('Invalid webhook signature')

        try:
            timestamp = int(payload.split('"timestamp":')[-1].split(',')[0].strip())
            current_time = int(time.time())
            
            if abs(current_time - timestamp) > tolerance:
                raise AuthenticationFailed('Webhook timestamp too old')
        except (ValueError, IndexError):
            pass

        return True


def verify_webhook_signature(view_func):
    def wrapper(request, *args, **kwargs):
        signature = request.headers.get('X-Webhook-Signature')
        timestamp = request.headers.get('X-Webhook-Timestamp')
        
        if not signature:
            raise AuthenticationFailed('Missing webhook signature')
        
        webhook_secret = getattr(settings, 'WEBHOOK_SECRET', None)
        if not webhook_secret:
            raise AuthenticationFailed('Webhook not configured')
        
        payload = request.body.decode('utf-8') if request.body else ''
        
        try:
            WebhookSignatureVerifier.verify_signature(payload, signature, webhook_secret)
        except AuthenticationFailed as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        
        return view_func(request, *args, **kwargs)
    return wrapper


def validate_webhook_url(url: str) -> bool:
    """Validate webhook URL to prevent SSRF attacks."""
    return SSRFProtection.validate_url(url)
