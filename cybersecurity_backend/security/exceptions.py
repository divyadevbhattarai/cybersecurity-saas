"""
Custom exception handler for secure API error responses.
Prevents information leakage through error messages.
"""
import logging
import sys

from django.conf import settings
from rest_framework import status
from rest_framework.exceptions import APIException, AuthenticationFailed, Throttled, PermissionDenied
from rest_framework.response import Response
from rest_framework.views import exception_handler

logger = logging.getLogger(__name__)


def get_error_code(exception: Exception) -> str:
    """Map exception types to error codes."""
    error_codes = {
        'AuthenticationFailed': 'AUTHENTICATION_ERROR',
        'InvalidToken': 'INVALID_TOKEN',
        'TokenExpired': 'TOKEN_EXPIRED',
        'PermissionDenied': 'PERMISSION_DENIED',
        'NotAuthenticated': 'NOT_AUTHENTICATED',
        'Throttled': 'RATE_LIMIT_EXCEEDED',
        'MethodNotAllowed': 'METHOD_NOT_ALLOWED',
        'NotFound': 'RESOURCE_NOT_FOUND',
        'ValidationError': 'VALIDATION_ERROR',
    }
    
    exception_name = exception.__class__.__name__
    return error_codes.get(exception_name, 'INTERNAL_ERROR')


def sanitize_error_message(message: str, is_debug: bool) -> str:
    """Remove sensitive information from error messages."""
    if is_debug:
        return message
    
    sensitive_patterns = [
        'password', 'token', 'secret', 'key', 'credential',
        'api_key', 'private', 'signature', 'hash'
    ]
    
    message_lower = message.lower()
    for pattern in sensitive_patterns:
        if pattern in message_lower:
            return "An error occurred. Please contact support."
    
    return message


def custom_exception_handler(exc, context):
    """Handle exceptions with secure error responses."""
    response = exception_handler(exc, context)
    
    is_debug = settings.DEBUG
    
    if response is not None:
        error_code = get_error_code(exc)
        
        response.data = {
            'error': {
                'code': error_code,
                'message': sanitize_error_message(
                    str(exc.detail) if hasattr(exc, 'detail') else str(exc),
                    is_debug
                ),
            }
        }
        
        if is_debug:
            response.data['error']['details'] = str(exc)
        
        response.status_code = response.status_code
        
        if isinstance(exc, AuthenticationFailed):
            response.status_code = status.HTTP_401_UNAUTHORIZED
            response['WWW-Authenticate'] = 'Bearer'
        elif isinstance(exc, Throttled):
            response.status_code = status.HTTP_429_TOO_MANY_REQUESTS
            response['Retry-After'] = str(getattr(exc, 'wait', 60))
        elif isinstance(exc, PermissionDenied):
            response.status_code = status.HTTP_403_FORBIDDEN
        elif isinstance(exc, APIException) and getattr(exc, 'status_code', None) == 404:
            response.status_code = status.HTTP_404_NOT_FOUND
    
    else:
        logger.exception(
            "Unhandled exception: %s",
            exc,
            extra={'request': context.get('request')}
        )
        
        response_data = {
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'An unexpected error occurred' if not is_debug else str(exc),
            }
        }
        
        if is_debug:
            import traceback
            tb = traceback.format_exception(*sys.exc_info())
            response_data['error']['traceback'] = ''.join(tb)
        
        response = Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return response


class RateLimitExceeded(Exception):
    """Custom exception for rate limiting."""
    pass


class InvalidAPIKey(Exception):
    """Custom exception for invalid API keys."""
    pass


class DeviceNotRecognized(Exception):
    """Custom exception for unrecognized devices."""
    pass


class TokenRevoked(Exception):
    """Custom exception for revoked tokens."""
    pass
