from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=64, blank=True, null=True)
    email_verification_expires = models.DateTimeField(blank=True, null=True)
    password_reset_token = models.CharField(max_length=64, blank=True, null=True)
    password_reset_expires = models.DateTimeField(blank=True, null=True)
    failed_login_attempts = models.IntegerField(default=0)
    locked_until = models.DateTimeField(blank=True, null=True)
    totp_secret = models.CharField(max_length=32, blank=True, null=True)
    is_totp_enabled = models.BooleanField(default=False)
    backup_codes = models.JSONField(default=list, blank=True)
