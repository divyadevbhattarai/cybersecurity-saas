from rest_framework import views, status, serializers
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from .models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from .account_lockout import AccountLockoutService

MAX_LOGIN_ATTEMPTS = 5

# Register User - Secure password handling
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.get('password')
        validate_password(password)  # Ensure password meets Django's security standards
        user = User.objects.create_user(**validated_data)
        return user

# User Registration API
class RegisterView(views.APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login User - Return JWT tokens
class LoginView(views.APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

        if user.locked_until and user.locked_until > timezone.now():
            remaining_minutes = (user.locked_until - timezone.now()).seconds // 60
            return Response({
                'error': f'Account is locked. Try again in {remaining_minutes} minutes.'
            }, status=status.HTTP_403_FORBIDDEN)

        if user.check_password(password):
            AccountLockoutService.reset_failed_logins(user)
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            })
        
        AccountLockoutService.record_failed_login(user)
        remaining_attempts = MAX_LOGIN_ATTEMPTS - user.failed_login_attempts
        if remaining_attempts <= 0:
            return Response({
                'error': 'Account locked due to too many failed attempts'
            }, status=status.HTTP_403_FORBIDDEN)
        return Response({
            'error': 'Invalid credentials',
            'remaining_attempts': remaining_attempts
        }, status=status.HTTP_400_BAD_REQUEST)
