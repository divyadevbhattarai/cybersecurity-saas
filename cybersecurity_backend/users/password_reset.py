from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from django.utils.crypto import get_random_string
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import User


class PasswordResetService:
    @staticmethod
    def generate_token():
        return get_random_string(64)

    @staticmethod
    def send_reset_email(user):
        token = PasswordResetService.generate_token()
        
        user.password_reset_token = token
        user.password_reset_expires = timezone.now() + timezone.timedelta(hours=1)
        user.save()

        reset_url = f"{settings.FRONTEND_URL}/reset-password/{token}/"
        
        subject = 'Reset your CyberShield password'
        message = f'''
You requested a password reset for your CyberShield account.

Click the link below to reset your password:
{reset_url}

This link will expire in 1 hour.

If you did not request this, please ignore this email and your password will remain unchanged.
'''
        
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            return True
        except Exception:
            return False


@api_view(['POST'])
@permission_classes([AllowAny])
def request_password_reset(request):
    email = request.data.get('email')
    
    if not email:
        return Response(
            {'error': 'Email is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(email=email)
        PasswordResetService.send_reset_email(user)
    except User.DoesNotExist:
        pass
    
    return Response(
        {'message': 'If the email exists, a password reset link has been sent'},
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_password_reset_token(request):
    token = request.data.get('token')
    
    if not token:
        return Response(
            {'error': 'Token is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(
            password_reset_token=token,
            password_reset_expires__gt=timezone.now()
        )
        return Response(
            {'valid': True, 'user_id': user.id},
            status=status.HTTP_200_OK
        )
    except User.DoesNotExist:
        return Response(
            {'valid': False, 'error': 'Invalid or expired token'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    token = request.data.get('token')
    new_password = request.data.get('new_password')
    
    if not token or not new_password:
        return Response(
            {'error': 'Token and new password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(
            password_reset_token=token,
            password_reset_expires__gt=timezone.now()
        )
    except User.DoesNotExist:
        return Response(
            {'error': 'Invalid or expired token'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user.set_password(new_password)
    user.password_reset_token = None
    user.password_reset_expires = None
    user.failed_login_attempts = 0
    user.locked_until = None
    user.save()
    
    return Response(
        {'message': 'Password reset successfully'},
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')
    
    if not current_password or not new_password:
        return Response(
            {'error': 'Current password and new password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not user.check_password(current_password):
        return Response(
            {'error': 'Current password is incorrect'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user.set_password(new_password)
    user.save()
    
    return Response(
        {'message': 'Password changed successfully'},
        status=status.HTTP_200_OK
    )
