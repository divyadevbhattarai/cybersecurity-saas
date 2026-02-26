from django.urls import path
from .views import CloudAuditView

urlpatterns = [
    path('audit/', CloudAuditView.as_view(), name='cloud_audit'),  # Endpoint to trigger the audit
]
