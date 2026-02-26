from django.urls import path
from .views import AIThreatDetectionView

urlpatterns = [
    path('threat-detection/', AIThreatDetectionView.as_view(), name='ai-threat-detection'),  # Endpoint for anomaly detection
]
