from django.urls import path
from .views import (
    AIThreatDetectionView,
    AdvancedThreatDetectionView,
    ThreatIntelligenceView,
    ThreatPredictionView,
    SecurityIncidentView,
    IncidentDetailView,
    DashboardMetricsView,
    SecurityEventView,
    SecurityMetricsView,
    RealTimeAlertsView,
    AlertAcknowledgeView,
    AnalyticsDashboardView,
    GenerateSampleDataView,
)

urlpatterns = [
    path('threat-detection/', AIThreatDetectionView.as_view(), name='ai-threat-detection'),
    path('threats/detect/', AdvancedThreatDetectionView.as_view(), name='advanced-threat-detection'),
    path('threats/intelligence/', ThreatIntelligenceView.as_view(), name='threat-intelligence'),
    path('threats/predictions/', ThreatPredictionView.as_view(), name='threat-predictions'),
    path('incidents/', SecurityIncidentView.as_view(), name='security-incidents'),
    path('incidents/<int:pk>/', IncidentDetailView.as_view(), name='incident-detail'),
    path('dashboard/metrics/', DashboardMetricsView.as_view(), name='dashboard-metrics'),
    path('events/', SecurityEventView.as_view(), name='security-events'),
    path('metrics/', SecurityMetricsView.as_view(), name='security-metrics'),
    path('alerts/', RealTimeAlertsView.as_view(), name='real-time-alerts'),
    path('alerts/<int:pk>/acknowledge/', AlertAcknowledgeView.as_view(), name='alert-acknowledge'),
    path('analytics/dashboard/', AnalyticsDashboardView.as_view(), name='analytics-dashboard'),
    path('analytics/generate-sample/', GenerateSampleDataView.as_view(), name='generate-sample-data'),
]
