import pyotp
import secrets
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import User


class TwoFactorAuthService:
    @staticmethod
    def generate_secret():
        return pyotp.random_base32()

    @staticmethod
    def generate_qr_uri(secret, username, issuer='CyberShield'):
        totp = pyotp.TOTP(secret)
        return totp.provisioning_uri(name=username, issuer_name=issuer)

    @staticmethod
    def verify_code(secret, code):
        totp = pyotp.TOTP(secret)
        return totp.verify(code)

    @staticmethod
    def generate_backup_codes():
        return [secrets.token_hex(4).upper() for _ in range(10)]


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def setup_2fa(request):
    user = request.user
    
    if user.is_totp_enabled:
        return Response(
            {'error': '2FA is already enabled'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    secret = TwoFactorAuthService.generate_secret()
    qr_uri = TwoFactorAuthService.generate_qr_uri(secret, user.username)
    
    user.totp_secret = secret
    user.save()
    
    return Response({
        'secret': secret,
        'qr_uri': qr_uri,
        'message': 'Please verify the code to enable 2FA'
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_2fa_setup(request):
    user = request.user
    code = request.data.get('code')
    
    if not code:
        return Response(
            {'error': 'Verification code is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not TwoFactorAuthService.verify_code(user.totp_secret, code):
        return Response(
            {'error': 'Invalid verification code'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    backup_codes = TwoFactorAuthService.generate_backup_codes()
    
    user.is_totp_enabled = True
    user.backup_codes = backup_codes
    user.save()
    
    return Response({
        'message': '2FA enabled successfully',
        'backup_codes': backup_codes
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def disable_2fa(request):
    user = request.user
    code = request.data.get('code')
    
    if not code:
        return Response(
            {'error': 'Verification code is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not TwoFactorAuthService.verify_code(user.totp_secret, code):
        return Response(
            {'error': 'Invalid verification code'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user.is_totp_enabled = False
    user.totp_secret = None
    user.backup_codes = []
    user.save()
    
    return Response(
        {'message': '2FA disabled successfully'},
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_2fa_code(request):
    user = request.user
    code = request.data.get('code')
    
    if not code:
        return Response(
            {'error': 'Verification code is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if TwoFactorAuthService.verify_code(user.totp_secret, code):
        return Response({
            'valid': True,
            'message': '2FA verification successful'
        }, status=status.HTTP_200_OK)
    
    if code in user.backup_codes:
        backup_codes = user.backup_codes
        backup_codes.remove(code)
        user.backup_codes = backup_codes
        user.save()
        
        return Response({
            'valid': True,
            'message': 'Backup code used successfully'
        }, status=status.HTTP_200_OK)
    
    return Response(
        {'valid': False, 'error': 'Invalid verification code'},
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_2fa_status(request):
    user = request.user
    
    return Response({
        'is_enabled': user.is_totp_enabled,
        'backup_codes_remaining': len(user.backup_codes) if user.backup_codes else 0
    }, status=status.HTTP_200_OK)
