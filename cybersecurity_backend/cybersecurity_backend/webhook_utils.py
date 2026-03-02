import hmac
import hashlib
import time
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed


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
