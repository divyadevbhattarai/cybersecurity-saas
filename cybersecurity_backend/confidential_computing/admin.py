from django.contrib import admin
from .models import Enclave, SecureSession


@admin.register(Enclave)
class EnclaveAdmin(admin.ModelAdmin):
    list_display = ['name', 'enclave_type', 'status', 'created_at']
    list_filter = ['enclave_type', 'status']
    search_fields = ['name']


@admin.register(SecureSession)
class SecureSessionAdmin(admin.ModelAdmin):
    list_display = ['session_id', 'enclave', 'started_at', 'expires_at']
    list_filter = ['started_at']
    search_fields = ['session_id', 'enclave__name']
