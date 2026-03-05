"""
RBAC/ABAC Permission System for Cybersecurity SaaS
Implements Zero Trust access control with fine-grained authorization.
"""
from typing import List, Optional, Set, Dict, Any, Callable
from enum import Enum
import hashlib
import logging

from rest_framework import permissions
from rest_framework.request import Request

from .middleware import TenantContext

logger = logging.getLogger(__name__)


class Role(Enum):
    """Application roles with hierarchy."""
    SUPER_ADMIN = 'super_admin'
    TENANT_ADMIN = 'tenant_admin'
    SECURITY_ANALYST = 'security_analyst'
    AUDITOR = 'auditor'
    USER = 'user'
    VIEWER = 'viewer'


class Permission(Enum):
    """Fine-grained permissions."""
    # Tenant management
    MANAGE_TENANT = 'manage_tenant'
    VIEW_TENANT = 'view_tenant'
    
    # User management
    MANAGE_USERS = 'manage_users'
    INVITE_USERS = 'invite_users'
    VIEW_USERS = 'view_users'
    MANAGE_ROLES = 'manage_roles'
    
    # Authentication
    MANAGE_MFA = 'manage_mfa'
    VIEW_OWN_PROFILE = 'view_own_profile'
    EDIT_OWN_PROFILE = 'edit_own_profile'
    
    # Security operations
    RUN_AUDITS = 'run_audits'
    VIEW_AUDITS = 'view_audits'
    EXPORT_AUDITS = 'export_audits'
    MANAGE_PLAYBOOKS = 'manage_playbooks'
    EXECUTE_PLAYBOOKS = 'execute_playbooks'
    VIEW_PLAYBOOKS = 'view_playbooks'
    
    # ZTNA
    MANAGE_ZTNA = 'manage_ztna'
    VIEW_ZTNA = 'view_ztna'
    MANAGE_DEVICES = 'manage_devices'
    
    # Cloud integrations
    MANAGE_INTEGRATIONS = 'manage_integrations'
    VIEW_INTEGRATIONS = 'view_integrations'
    
    # Data
    EXPORT_DATA = 'export_data'
    VIEW_SENSITIVE_DATA = 'view_sensitive_data'
    MANAGE_RETENTION = 'manage_retention'
    
    # Billing
    MANAGE_BILLING = 'manage_billing'
    VIEW_BILLING = 'view_billing'
    
    # Reports
    VIEW_REPORTS = 'view_reports'
    GENERATE_REPORTS = 'generate_reports'


# Role-Permission mapping (whitelist approach)
ROLE_PERMISSIONS: Dict[Role, Set[Permission]] = {
    Role.SUPER_ADMIN: set(Permission),  # All permissions
    
    Role.TENANT_ADMIN: {
        Permission.VIEW_TENANT,
        Permission.MANAGE_USERS,
        Permission.INVITE_USERS,
        Permission.VIEW_USERS,
        Permission.MANAGE_ROLES,
        Permission.MANAGE_MFA,
        Permission.VIEW_OWN_PROFILE,
        Permission.EDIT_OWN_PROFILE,
        Permission.RUN_AUDITS,
        Permission.VIEW_AUDITS,
        Permission.EXPORT_AUDITS,
        Permission.MANAGE_PLAYBOOKS,
        Permission.EXECUTE_PLAYBOOKS,
        Permission.VIEW_PLAYBOOKS,
        Permission.MANAGE_ZTNA,
        Permission.VIEW_ZTNA,
        Permission.MANAGE_DEVICES,
        Permission.MANAGE_INTEGRATIONS,
        Permission.VIEW_INTEGRATIONS,
        Permission.EXPORT_DATA,
        Permission.VIEW_SENSITIVE_DATA,
        Permission.VIEW_REPORTS,
        Permission.GENERATE_REPORTS,
        Permission.VIEW_BILLING,
    },
    
    Role.SECURITY_ANALYST: {
        Permission.VIEW_TENANT,
        Permission.VIEW_USERS,
        Permission.VIEW_OWN_PROFILE,
        Permission.EDIT_OWN_PROFILE,
        Permission.RUN_AUDITS,
        Permission.VIEW_AUDITS,
        Permission.EXPORT_AUDITS,
        Permission.MANAGE_PLAYBOOKS,
        Permission.EXECUTE_PLAYBOOKS,
        Permission.VIEW_PLAYBOOKS,
        Permission.VIEW_ZTNA,
        Permission.VIEW_INTEGRATIONS,
        Permission.EXPORT_DATA,
        Permission.VIEW_REPORTS,
        Permission.GENERATE_REPORTS,
    },
    
    Role.AUDITOR: {
        Permission.VIEW_TENANT,
        Permission.VIEW_USERS,
        Permission.VIEW_OWN_PROFILE,
        Permission.VIEW_AUDITS,
        Permission.EXPORT_AUDITS,
        Permission.VIEW_PLAYBOOKS,
        Permission.VIEW_ZTNA,
        Permission.VIEW_INTEGRATIONS,
        Permission.VIEW_REPORTS,
    },
    
    Role.USER: {
        Permission.VIEW_OWN_PROFILE,
        Permission.EDIT_OWN_PROFILE,
        Permission.VIEW_ZTNA,
        Permission.VIEW_REPORTS,
    },
    
    Role.VIEWER: {
        Permission.VIEW_OWN_PROFILE,
    },
}


class PermissionChecker:
    """
    Central permission checking logic.
    Supports both RBAC and ABAC (attribute-based conditions).
    """
    
    def __init__(self, user):
        self.user = user
        self.role = getattr(user, 'role', Role.USER)
    
    def has_permission(self, permission: Permission) -> bool:
        """Check if user has specific permission via RBAC."""
        if not self.user.is_authenticated:
            return False
        
        # Super admins have access to everything
        if self.user.is_superuser:
            return True
        
        # Check role-based permissions
        role_perms = ROLE_PERMISSIONS.get(self.role, set())
        return permission in role_perms
    
    def has_any_permission(self, permissions: List[Permission]) -> bool:
        """Check if user has any of the specified permissions."""
        return any(self.has_permission(p) for p in permissions)
    
    def has_all_permissions(self, permissions: List[Permission]) -> bool:
        """Check if user has all of the specified permissions."""
        return all(self.has_permission(p) for p in permissions)
    
    def check_abac(self, permission: Permission, context: Dict[str, Any]) -> bool:
        """
        Check attribute-based access control conditions.
        Allows contextual authorization beyond role.
        """
        # Base permission check first
        if not self.has_permission(permission):
            return False
        
        # Time-based access restrictions
        if 'time_restricted' in context:
            # Example: Only allow during business hours
            # Implement based on requirements
            pass
        
        # IP-based restrictions
        if 'allowed_ips' in context:
            client_ip = context.get('client_ip')
            if client_ip and client_ip not in context['allowed_ips']:
                return False
        
        # Device trust level requirements
        if 'min_trust_level' in context:
            device_trust = context.get('device_trust_score', 0)
            if device_trust < context['min_trust_level']:
                return False
        
        # MFA requirement
        if context.get('require_mfa') and not getattr(self.user, 'is_totp_enabled', False):
            return False
        
        return True
    
    def can_access_object(self, obj, action: str = 'view') -> bool:
        """
        Check if user can access specific object.
        Implements object-level authorization.
        """
        # Check tenant boundary
        if hasattr(obj, 'tenant_id'):
            user_tenant_id = getattr(self.user, 'tenant_id', None)
            if user_tenant_id != obj.tenant_id:
                logger.warning(
                    f"Cross-tenant access attempt: user {self.user.id} "
                    f"(tenant {user_tenant_id}) tried to access "
                    f"object in tenant {obj.tenant_id}"
                )
                return False
        
        # Check ownership
        if hasattr(obj, 'user_id'):
            if obj.user_id != self.user.id:
                # Check if user has elevated permissions
                if not self.has_permission(Permission.VIEW_SENSITIVE_DATA):
                    return False
        
        return True


class TenantPermission(permissions.BasePermission):
    """
    DRF permission class ensuring tenant isolation.
    Zero Trust: Verify tenant at every request.
    """
    message = "Access denied: Tenant context required"
    
    def has_permission(self, request: Request, view) -> bool:
        # Tenant context should be set by middleware
        tenant_id = TenantContext.get_tenant()
        
        if tenant_id is None:
            # Allow certain public endpoints
            if getattr(view, 'allow_anonymous', False):
                return True
            
            logger.warning(
                f"Access denied: No tenant context for {request.path} "
                f"from {request.META.get('REMOTE_ADDR')}"
            )
            return False
        
        # Verify user belongs to same tenant
        user_tenant_id = getattr(request.user, 'tenant_id', None)
        if user_tenant_id != tenant_id:
            logger.warning(
                f"Tenant mismatch: user tenant {user_tenant_id} "
                f"vs context tenant {tenant_id}"
            )
            return False
        
        return True


class RoleBasedPermission(permissions.BasePermission):
    """
    DRF permission class for RBAC.
    """
    
    def __init__(self, required_permissions: List[Permission] = None,
                 require_all: bool = False):
        self.required_permissions = required_permissions or []
        self.require_all = require_all
    
    def __call__(self):
        return self
    
    def has_permission(self, request: Request, view) -> bool:
        if not request.user.is_authenticated:
            return False
        
        # Read permission from view
        view_perm = getattr(view, 'required_permission', None)
        if view_perm:
            checker = PermissionChecker(request.user)
            return checker.has_permission(view_perm)
        
        # Check specified permissions
        if not self.required_permissions:
            return True
        
        checker = PermissionChecker(request.user)
        
        if self.require_all:
            return checker.has_all_permissions(self.required_permissions)
        else:
            return checker.has_any_permission(self.required_permissions)


class ABACPermission(permissions.BasePermission):
    """
    DRF permission class for ABAC.
    Allows contextual authorization.
    """
    
    def __init__(self, permission: Permission, 
                 abac_conditions: Callable = None):
        self.permission = permission
        self.abac_conditions = abac_conditions
    
    def has_permission(self, request: Request, view) -> bool:
        if not request.user.is_authenticated:
            return False
        
        checker = PermissionChecker(request.user)
        
        # Build context from request
        context = self._build_context(request, view)
        
        # ABAC check
        if self.abac_conditions:
            return checker.check_abac(self.permission, context)
        
        return checker.has_permission(self.permission)
    
    def _build_context(self, request: Request, view) -> Dict[str, Any]:
        """Build authorization context from request."""
        return {
            'client_ip': request.META.get('REMOTE_ADDR'),
            'user_agent': request.META.get('HTTP_USER_AGENT'),
            'tenant_id': TenantContext.get_tenant(),
            'device_trust_score': getattr(request.user, 'device_trust_score', 0),
            'is_mfa_enabled': getattr(request.user, 'is_totp_enabled', False),
        }


class ObjectPermission(permissions.BasePermission):
    """
    DRF permission class for object-level authorization.
    """
    
    def has_object_permission(self, request: Request, view, obj: Any) -> bool:
        if not request.user.is_authenticated:
            return False
        
        checker = PermissionChecker(request.user)
        action = request.method.lower()
        
        return checker.can_access_object(obj, action)


# Permission decorators for function-based views
def require_permission(permission: Permission):
    """Decorator for function-based views."""
    def decorator(func):
        def wrapper(request, *args, **kwargs):
            if not request.user.is_authenticated:
                from rest_framework.response import Response
                from rest_framework import status
                return Response(
                    {'error': 'Authentication required'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            checker = PermissionChecker(request.user)
            if not checker.has_permission(permission):
                return Response(
                    {'error': 'Permission denied'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            return func(request, *args, **kwargs)
        return wrapper
    return decorator


def require_abac(permission: Permission, conditions: Callable):
    """Decorator for ABAC function-based views."""
    def decorator(func):
        def wrapper(request, *args, **kwargs):
            if not request.user.is_authenticated:
                from rest_framework.response import Response
                from rest_framework import status
                return Response(
                    {'error': 'Authentication required'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            checker = PermissionChecker(request.user)
            context = conditions(request)
            
            if not checker.check_abac(permission, context):
                return Response(
                    {'error': 'Permission denied'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            return func(request, *args, **kwargs)
        return wrapper
    return decorator


# Example usage in views
"""
from security.permissions import (
    RoleBasedPermission, 
    ABACPermission, 
    Permission,
    TenantPermission
)

class SensitiveDataView(APIView):
    permission_classes = [
        TenantPermission,
        RoleBasedPermission(
            [Permission.VIEW_SENSITIVE_DATA],
            require_all=True
        ),
    ]
    
    def get(self, request):
        # Only users with VIEW_SENSITIVE_DATA permission
        # and within same tenant can access
        pass

class AuditView(APIView):
    required_permission = Permission.VIEW_AUDITS
    
    permission_classes = [
        TenantPermission,
        RoleBasedPermission,
    ]
"""

# Audit logging for authorization decisions
class AuthorizationLogger:
    """Log authorization decisions for security monitoring."""
    
    @staticmethod
    def log_access(request: Request, granted: bool, 
                   permission: Permission = None, resource: str = None):
        """Log authorization decision."""
        logger.info(
            f"Authorization: {'GRANTED' if granted else 'DENIED'} | "
            f"User: {request.user.id} | "
            f"Permission: {permission.name if permission else 'N/A'} | "
            f"Resource: {resource or request.path} | "
            f"IP: {request.META.get('REMOTE_ADDR')}"
        )
    
    @staticmethod
    def log_violation(request: Request, violation_type: str, details: str):
        """Log authorization violation."""
        logger.warning(
            f"Authorization VIOLATION: {violation_type} | "
            f"User: {request.user.id} | "
            f"Details: {details} | "
            f"IP: {request.META.get('REMOTE_ADDR')}"
        )
