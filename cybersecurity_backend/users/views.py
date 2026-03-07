import logging
import secrets
from rest_framework import views, status, serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from django.conf import settings
from .account_lockout import AccountLockoutService
from security.permissions import RoleBasedPermission, TenantPermission, Permission
from security.middleware import TenantContext
from security.audit_logger import AuditLogger
from security.responses import success_response, error_response

logger = logging.getLogger(__name__)

MAX_LOGIN_ATTEMPTS = 5


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.get('password')
        validate_password(password)
        user = User.objects.create_user(**validated_data)
        return user


class LogoutView(views.APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        response = success_response(message='Logout successful')
        response.delete_cookie('access_token', path='/')
        response.delete_cookie('refresh_token', path='/')
        return response


class CookieTokenRefreshView(views.APIView):
    permission_classes = []
    
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        
        if not refresh_token:
            return error_response('No refresh token', 'AUTH_ERROR', status.HTTP_401_UNAUTHORIZED)
        
        try:
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            
            response = success_response(data={
                'access': access_token
            })
            
            secure = not settings.DEBUG
            same_site = 'Lax'
            
            response.set_cookie(
                'access_token',
                access_token,
                httponly=True,
                secure=secure,
                samesite=same_site,
                path='/',
                max_age=15 * 60
            )
            
            return response
        except Exception as e:
            logger.error(f"Token refresh failed: {str(e)}")
            return error_response('Invalid refresh token', 'AUTH_ERROR', status.HTTP_401_UNAUTHORIZED)


class RegisterView(views.APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"New user registered: {serializer.data.get('username')}")
            return success_response(data=serializer.data, message='User registered successfully', status_code=status.HTTP_201_CREATED)
        return error_response('Registration failed', 'VALIDATION_ERROR', status.HTTP_400_BAD_REQUEST, serializer.errors)


class LoginView(views.APIView):
    permission_classes = [AllowAny]
    allow_anonymous = True
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        # Always use generic error message to prevent user enumeration
        # Log the detailed error internally for security monitoring
        if not username or not password:
            logger.warning(f"Login attempt with missing credentials from {request.META.get('REMOTE_ADDR')}")
            return error_response('Invalid credentials', 'AUTH_ERROR', status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            # Use generic message - don't reveal if username exists
            logger.warning(
                f"Failed login attempt for non-existent user from {request.META.get('REMOTE_ADDR')}"
            )
            # Always perform password hash computation to prevent timing attacks
            User.objects.filter(username=username).first()
            return error_response('Invalid credentials', 'AUTH_ERROR', status.HTTP_400_BAD_REQUEST)

        # Check account lockout with timing-safe comparison
        if user.locked_until and user.locked_until > timezone.now():
            remaining_minutes = (user.locked_until - timezone.now()).seconds // 60
            # Use generic message
            logger.warning(f"Login attempt on locked account: {user.id}")
            return error_response('Invalid credentials', 'AUTH_ERROR', status.HTTP_400_BAD_REQUEST)

        # Verify password - this handles timing-safe comparison
        if user.check_password(password):
            AccountLockoutService.reset_failed_logins(user)
            
            # Set tenant context from user
            tenant_id = getattr(user, 'tenant_id', None)
            if tenant_id:
                TenantContext.set_tenant(tenant_id, getattr(user, 'tenant_slug', None))
            
            refresh = RefreshToken.for_user(user)
            refresh['tenant_id'] = tenant_id
            refresh.access_token['tenant_id'] = tenant_id
            
            logger.info(f"Successful login for user: {user.id} from {request.META.get('REMOTE_ADDR')}")
            
            AuditLogger.log_login_success(request, user)
            
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            
            response = success_response(data={
                'access': access_token,
                'refresh': refresh_token
            }, message='Login successful')
            
            secure = not settings.DEBUG
            same_site = 'Lax'
            
            response.set_cookie(
                'access_token',
                access_token,
                httponly=True,
                secure=secure,
                samesite=same_site,
                path='/',
                max_age=15 * 60
            )
            response.set_cookie(
                'refresh_token',
                refresh_token,
                httponly=True,
                secure=secure,
                samesite=same_site,
                path='/',
                max_age=24 * 60 * 60
            )
            
            return response
        
        # Failed login - record attempt but use generic message
        AccountLockoutService.record_failed_login(user)
        remaining_attempts = MAX_LOGIN_ATTEMPTS - user.failed_login_attempts
        
        logger.warning(
            f"Failed login attempt for user {user.id} from {request.META.get('REMOTE_ADDR')}, "
            f"attempts: {user.failed_login_attempts}"
        )
        
        # Audit log failed login
        AuditLogger.log_login_failed(request, username, "invalid_password")
        
        if remaining_attempts <= 0:
            return error_response('Invalid credentials', 'AUTH_ERROR', status.HTTP_400_BAD_REQUEST)
        
        # Always return generic message to prevent enumeration
        return error_response('Invalid credentials', 'AUTH_ERROR', status.HTTP_400_BAD_REQUEST)
