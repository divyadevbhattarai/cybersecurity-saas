from django.urls import path
from .views import RegisterView, LoginView, LogoutView, CookieTokenRefreshView
from .password_reset import request_password_reset, verify_password_reset_token, reset_password, change_password
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', csrf_exempt(CookieTokenRefreshView.as_view()), name='token_refresh'),
    path('password-reset/request/', request_password_reset, name='password_reset_request'),
    path('password-reset/verify/', verify_password_reset_token, name='password_reset_verify'),
    path('password-reset/reset/', reset_password, name='password_reset'),
    path('change-password/', change_password, name='change_password'),
]
