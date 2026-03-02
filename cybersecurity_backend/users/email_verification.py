from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from django.utils.crypto import get_random_string
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import User


class EmailVerificationService:
    @staticmethod
    def generate_token(user):
        return get_random_string(64)

    @staticmethod
    def send_verification_email(user):
        token = EmailVerificationService.generate_token(user)
        
        user.email_verification_token = token
        user.email_verification_expires = timezone.now() + timezone.timedelta(days=1)
        user.is_active = False
        user.save()

        verification_url = f"{settings.FRONTEND_URL}/verify-email/{token}/"
        
        subject = 'Verify your CyberShield account'
        message = f'''
Welcome to CyberShield!

Please verify your email address by clicking the link below:
{verification_url}

This link will expire in 24 hours.

If you did not create this account, please ignore this email.
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

    @staticmethod
    def verify_token(token):
        try:
            user = User.objects.get(
                email_verification_token=token,
                email_verification_expires__gt=timezone.now()
            )
            user.is_active = True
            user.email_verified = True
            user.email_verification_token = None
            user.email_verification_expires = None
            user.save()
            return user
        except User.DoesNotExist:
            return None


@api_view(['POST'])
@permission_classes([AllowAny])
def request_email_verification(request):
    email = request.data.get('email')
    
    if not email:
        return Response(
            {'error': 'Email is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {'message': 'If the email exists, a verification link has been sent'},
            status=status.HTTP_200_OK
        )
    
    if user.email_verified:
        return Response(
            {'error': 'Email is already verified'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    EmailVerificationService.send_verification_email(user)
    
    return Response(
        {'message': 'Verification email sent'},
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_email(request):
    token = request.data.get('token')
    
    if not token:
        return Response(
            {'error': 'Token is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = EmailVerificationService.verify_token(token)
    
    if user is None:
        return Response(
            {'error': 'Invalid or expired verification token'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    return Response(
        {'message': 'Email verified successfully'},
        status=status.HTTP_200_OK
    )
