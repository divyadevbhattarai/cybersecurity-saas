"""
Audit logging utilities for security events.
"""
import logging
import json
from datetime import datetime
from typing import Optional, Dict, Any
from django.contrib.auth import get_user_model

logger = logging.getLogger('security')


class AuditLogger:
    """
    Centralized audit logging for security events.
    Integrates with the AuditLog model and provides structured logging.
    """
    
    SECURITY_EVENTS = [
        'login_success',
        'login_failed',
        'logout',
        'password_change',
        'password_reset_request',
        'password_reset_complete',
        'api_key_created',
        'api_key_revoked',
        'permission_denied',
        'rate_limit_exceeded',
        'tenant_switch',
        'sensitive_data_access',
        'data_export',
        'admin_action',
        'register',
    ]
    
    @staticmethod
    def log_security_event(
        event_type: str,
        user=None,
        tenant_id: Optional[int] = None,
        resource: Optional[str] = None,
        action: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        request=None,
        save_to_db: bool = True,
    ):
        """Log a security event."""
        
        if request:
            ip_address = ip_address or AuditLogger._get_client_ip(request)
            user_agent = user_agent or request.META.get('HTTP_USER_AGENT', '')[:500]
        
        log_data = {
            'timestamp': datetime.utcnow().isoformat(),
            'event_type': event_type,
            'user_id': user.id if user and hasattr(user, 'id') else None,
            'username': str(user) if user else None,
            'tenant_id': tenant_id,
            'resource': resource,
            'action': action,
            'ip_address': ip_address,
            'user_agent': user_agent,
            'metadata': metadata or {},
        }
        
        logger.info(f"SECURITY_EVENT: {json.dumps(log_data)}")
        
        if save_to_db:
            AuditLogger._save_to_audit_log(
                user=user,
                tenant_id=tenant_id,
                action=action or event_type,
                resource=resource or event_type,
                ip_address=ip_address,
                user_agent=user_agent,
                metadata=log_data,
            )
        
        return log_data
    
    @staticmethod
    def _get_client_ip(request) -> str:
        """Extract client IP from request."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR', '')
    
    @staticmethod
    def _save_to_audit_log(
        user,
        tenant_id: Optional[int],
        action: str,
        resource: str,
        ip_address: Optional[str],
        user_agent: str,
        metadata: Dict[str, Any],
    ):
        """Save event to AuditLog model."""
        try:
            from audit_trail.models import AuditLog
            
            AuditLog.objects.create(
                user=user,
                tenant_id=tenant_id,
                action=action,
                resource=resource,
                ip_address=ip_address,
                user_agent=user_agent,
                metadata=metadata,
            )
        except Exception as e:
            logger.error(f"Failed to save audit log: {e}")
    
    @staticmethod
    def log_login_success(request, user):
        """Log successful login."""
        from security.middleware import TenantContext
        
        AuditLogger.log_security_event(
            event_type='login_success',
            user=user,
            tenant_id=TenantContext.get_tenant(),
            action='login',
            resource='auth',
            request=request,
        )
    
    @staticmethod
    def log_login_failed(request, username: str, reason: str = 'invalid_credentials'):
        """Log failed login attempt."""
        AuditLogger.log_security_event(
            event_type='login_failed',
            user=None,
            action='login_failed',
            resource='auth',
            metadata={'username': username, 'reason': reason},
            request=request,
            save_to_db=False,
        )
    
    @staticmethod
    def log_api_key_created(user, api_key_name: str, tenant_id: Optional[int] = None):
        """Log API key creation."""
        AuditLogger.log_security_event(
            event_type='api_key_created',
            user=user,
            tenant_id=tenant_id,
            action='create',
            resource='api_key',
            metadata={'key_name': api_key_name},
            save_to_db=True,
        )
    
    @staticmethod
    def log_api_key_revoked(user, api_key_name: str, tenant_id: Optional[int] = None):
        """Log API key revocation."""
        AuditLogger.log_security_event(
            event_type='api_key_revoked',
            user=user,
            tenant_id=tenant_id,
            action='delete',
            resource='api_key',
            metadata={'key_name': api_key_name},
            save_to_db=True,
        )
    
    @staticmethod
    def log_permission_denied(user, resource: str, permission: str, request=None):
        """Log permission denial."""
        from security.middleware import TenantContext
        
        AuditLogger.log_security_event(
            event_type='permission_denied',
            user=user,
            tenant_id=TenantContext.get_tenant(),
            action='access_denied',
            resource=resource,
            metadata={'required_permission': permission},
            request=request,
        )
    
    @staticmethod
    def log_sensitive_data_access(user, resource: str, data_type: str, request=None):
        """Log access to sensitive data."""
        from security.middleware import TenantContext
        
        AuditLogger.log_security_event(
            event_type='sensitive_data_access',
            user=user,
            tenant_id=TenantContext.get_tenant(),
            action='read',
            resource=resource,
            metadata={'data_type': data_type},
            request=request,
        )
    
    @staticmethod
    def log_data_export(user, resource: str, record_count: int, request=None):
        """Log data export."""
        from security.middleware import TenantContext
        
        AuditLogger.log_security_event(
            event_type='data_export',
            user=user,
            tenant_id=TenantContext.get_tenant(),
            action='export',
            resource=resource,
            metadata={'record_count': record_count},
            request=request,
        )
    
    @staticmethod
    def log_registration(request, user):
        """Log user registration."""
        from security.middleware import TenantContext
        
        AuditLogger.log_security_event(
            event_type='register',
            user=user,
            tenant_id=getattr(user, 'tenant_id', None),
            action='register',
            resource='auth',
            request=request,
        )


class AuditLogMixin:
    """
    Mixin for views to automatically log security events.
    """
    
    def get_audit_resource(self) -> str:
        """Override in subclass to specify resource type."""
        return self.__class__.__name__.lower().replace('view', '')
    
    def get_audit_action(self) -> str:
        """Override in subclass to specify action type."""
        return self.request.method.lower()
    
    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        
        if hasattr(request, 'user') and request.user and request.user.is_authenticated:
            if response.status_code in (200, 201):
                AuditLogger.log_security_event(
                    event_type=f"{self.get_audit_action()}_{self.get_audit_resource()}",
                    user=request.user,
                    action=self.get_audit_action(),
                    resource=self.get_audit_resource(),
                    request=request,
                    save_to_db=False,
                )
        
        return response


def audit_log(action: str, resource: str):
    """Decorator for automatic audit logging on view functions."""
    def decorator(view_func):
        def wrapper(request, *args, **kwargs):
            from security.middleware import TenantContext
            
            try:
                user = request.user if hasattr(request, 'user') else None
                AuditLogger.log_security_event(
                    event_type=f'{action}_{resource}',
                    user=user,
                    tenant_id=TenantContext.get_tenant(),
                    action=action,
                    resource=resource,
                    request=request,
                    save_to_db=True,
                )
            except Exception as e:
                logger.error(f"Audit log failed: {e}")
            
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator
