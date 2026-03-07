from rest_framework import serializers
from security.serializers import SanitizedModelSerializer
from .models import AnomalyDetectionResult, ThreatIntelligence, ThreatPrediction, SecurityIncident, SecurityEvent, SecurityMetric, RealTimeAlert


class AnomalyDetectionResultSerializer(SanitizedModelSerializer):
    class Meta:
        model = AnomalyDetectionResult
        fields = ['id', 'user_id', 'anomaly_type', 'status', 'details', 'timestamp']


class ThreatIntelligenceSerializer(SanitizedModelSerializer):
    class Meta:
        model = ThreatIntelligence
        fields = [
            'id', 'threat_type', 'severity', 'indicator', 'indicator_type',
            'description', 'source', 'confidence', 'first_seen', 'last_seen',
            'affected_assets', 'mitigations', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class ThreatPredictionSerializer(SanitizedModelSerializer):
    class Meta:
        model = ThreatPrediction
        fields = [
            'id', 'prediction_type', 'target', 'prediction', 'confidence',
            'risk_level', 'factors', 'recommendations', 'model_version',
            'predicted_at', 'valid_until'
        ]
        read_only_fields = ['predicted_at']


class SecurityIncidentSerializer(SanitizedModelSerializer):
    class Meta:
        model = SecurityIncident
        fields = [
            'id', 'incident_type', 'status', 'severity', 'title', 'description',
            'source', 'target_systems', 'affected_users', 'indicators',
            'ai_confidence', 'automated_action', 'containment_status',
            'detected_at', 'updated_at', 'resolved_at'
        ]
        read_only_fields = ['detected_at', 'updated_at']


class SecurityEventSerializer(SanitizedModelSerializer):
    class Meta:
        model = SecurityEvent
        fields = [
            'id', 'event_type', 'severity', 'source_ip', 'destination_ip',
            'user_id', 'user_email', 'resource', 'action', 'details',
            'risk_score', 'is_anomaly', 'timestamp', 'processed'
        ]
        read_only_fields = ['timestamp', 'processed']


class SecurityMetricSerializer(SanitizedModelSerializer):
    class Meta:
        model = SecurityMetric
        fields = [
            'id', 'metric_type', 'value', 'unit', 'period_start', 'period_end',
            'target', 'trend', 'details', 'recorded_at'
        ]
        read_only_fields = ['recorded_at']


class RealTimeAlertSerializer(SanitizedModelSerializer):
    class Meta:
        model = RealTimeAlert
        fields = [
            'id', 'alert_type', 'priority', 'title', 'description',
            'source_event', 'user_id', 'ip_address', 'asset_affected',
            'action_taken', 'acknowledged', 'acknowledged_by', 'acknowledged_at',
            'created_at'
        ]
        read_only_fields = ['created_at', 'acknowledged_at']
