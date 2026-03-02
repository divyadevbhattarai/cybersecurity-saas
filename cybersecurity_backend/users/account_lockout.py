from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import User


MAX_LOGIN_ATTEMPTS = 5
LOCKOUT_DURATION_MINUTES = 30


class AccountLockoutService:
    @staticmethod
    def check_account_lockout(user):
        if user.locked_until and user.locked_until > timezone.now():
            remaining_time = (user.locked_until - timezone.now()).seconds // 60
            return True, remaining_time
        return False, 0

    @staticmethod
    def record_failed_login(user):
        user.failed_login_attempts += 1
        
        if user.failed_login_attempts >= MAX_LOGIN_ATTEMPTS:
            user.locked_until = timezone.now() + timezone.timedelta(minutes=LOCKOUT_DURATION_MINUTES)
        
        user.save()

    @staticmethod
    def reset_failed_logins(user):
        user.failed_login_attempts = 0
        user.locked_until = None
        user.save()


@api_view(['POST'])
@permission_classes([AllowAny])
def check_account_status(request):
    username = request.data.get('username')
    
    if not username:
        return Response(
            {'error': 'Username is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(
            {'locked': False},
            status=status.HTTP_200_OK
        )
    
    is_locked, remaining_time = AccountLockoutService.check_account_lockout(user)
    
    return Response({
        'locked': is_locked,
        'remaining_attempts': MAX_LOGIN_ATTEMPTS - user.failed_login_attempts,
        'locked_until_minutes': remaining_time if is_locked else 0
    }, status=status.HTTP_200_OK)
