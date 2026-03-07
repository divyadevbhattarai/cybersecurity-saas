from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from django.conf import settings


class CookieJWTAuthentication(JWTAuthentication):
    """
    Custom JWT Authentication that supports both cookie and header-based authentication.
    Priority: Cookie > Authorization Header (for backward compatibility)
    """
    
    def authenticate(self, request):
        # Try to get token from cookie first
        access_token = request.COOKIES.get('access_token')
        
        if access_token:
            return self.authenticate_token(access_token, request)
        
        # Fallback to Authorization header for backward compatibility
        return super().authenticate(request)
    
    def authenticate_token(self, token, request):
        try:
            validated_token = self.get_validated_token(token)
            return (self.get_user(validated_token), validated_token)
        except Exception as e:
            raise AuthenticationFailed(str(e))
