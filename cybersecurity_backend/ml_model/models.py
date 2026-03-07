from django.db import models
from django.contrib.auth import get_user_model
from users.models import Tenant

User = get_user_model()


class AnomalyDetectionResult(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='anomaly_results',
        null=True,
        blank=True
    )
    user_id = models.IntegerField()
    anomaly_type = models.CharField(max_length=255)
    status = models.CharField(max_length=50, choices=[('detected', 'Detected'), ('resolved', 'Resolved')], default='detected')
    details = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Anomaly for User {self.user_id} - {self.anomaly_type}"


class ThreatIntelligence(models.Model):
    """Threat intelligence feed for global threat data"""
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='threat_intelligence',
        null=True,
        blank=True
    )
    THREAT_TYPES = [
        ('malware', 'Malware'),
        ('phishing', 'Phishing'),
        ('ransomware', 'Ransomware'),
        ('apt', 'APT'),
        ('insider', 'Insider Threat'),
        ('botnet', 'Botnet'),
        ('cryptojacking', 'Cryptojacking'),
    ]
    SEVERITY_LEVELS = [
        ('critical', 'Critical'),
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]
    threat_type = models.CharField(max_length=50, choices=THREAT_TYPES, db_index=True)
    severity = models.CharField(max_length=20, choices=SEVERITY_LEVELS, db_index=True)
    indicator = models.CharField(max_length=500, unique=True, db_index=True)
    indicator_type = models.CharField(max_length=50)
    description = models.TextField()
    source = models.CharField(max_length=255)
    confidence = models.FloatField(default=0.0)
    first_seen = models.DateTimeField()
    last_seen = models.DateTimeField()
    affected_assets = models.JSONField(default=list)
    mitigations = models.JSONField(default=list)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-last_seen']

    def __str__(self):
        return f"{self.threat_type} - {self.indicator[:20]}"


class ThreatPrediction(models.Model):
    """AI-powered threat prediction model results"""
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='threat_predictions',
        null=True,
        blank=True
    )
    PREDICTION_TYPES = [
        ('breach_likelihood', 'Breach Likelihood'),
        ('attack_vector', 'Attack Vector Prediction'),
        ('risk_score', 'Risk Score'),
        ('anomaly_score', 'Anomaly Score'),
        ('exploit_probability', 'Exploit Probability'),
    ]
    prediction_type = models.CharField(max_length=50, choices=PREDICTION_TYPES, db_index=True)
    target = models.CharField(max_length=255)
    prediction = models.JSONField()
    confidence = models.FloatField(default=0.0)
    risk_level = models.CharField(max_length=20)
    factors = models.JSONField(default=dict)
    recommendations = models.JSONField(default=list)
    model_version = models.CharField(max_length=50)
    predicted_at = models.DateTimeField(auto_now_add=True)
    valid_until = models.DateTimeField()

    class Meta:
        ordering = ['-predicted_at']

    def __str__(self):
        return f"{self.prediction_type} - {self.target} - {self.risk_level}"


class SecurityIncident(models.Model):
    """AI-detected security incidents"""
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='security_incidents',
        null=True,
        blank=True
    )
    INCIDENT_TYPES = [
        ('intrusion', 'Intrusion'),
        ('data_breach', 'Data Breach'),
        ('malware_detection', 'Malware Detection'),
        ('phishing', 'Phishing'),
        ('ddos', 'DDoS'),
        ('insider_threat', 'Insider Threat'),
        ('privilege_abuse', 'Privilege Abuse'),
    ]
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('investigating', 'Investigating'),
        ('contained', 'Contained'),
        ('remediated', 'Remediated'),
        ('closed', 'Closed'),
    ]
    SEVERITY_CHOICES = [
        ('critical', 'Critical'),
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]
    incident_type = models.CharField(max_length=50, choices=INCIDENT_TYPES, db_index=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open', db_index=True)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, db_index=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    source = models.CharField(max_length=255)
    target_systems = models.JSONField(default=list)
    affected_users = models.JSONField(default=list)
    indicators = models.JSONField(default=list)
    ai_confidence = models.FloatField(default=0.0)
    automated_action = models.CharField(max_length=100, blank=True)
    containment_status = models.CharField(max_length=50, blank=True)
    detected_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-detected_at']

    def __str__(self):
        return f"{self.incident_type} - {self.severity} - {self.status}"


class SecurityEvent(models.Model):
    """Real-time security events for analytics"""
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='security_events',
        null=True,
        blank=True
    )
    EVENT_TYPES = [
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('file_access', 'File Access'),
        ('network_connection', 'Network Connection'),
        ('privilege_change', 'Privilege Change'),
        ('config_change', 'Configuration Change'),
        ('api_call', 'API Call'),
        ('data_export', 'Data Export'),
        ('failed_auth', 'Failed Authentication'),
        ('suspicious_activity', 'Suspicious Activity'),
    ]
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES, db_index=True)
    severity = models.CharField(max_length=20, choices=[
        ('critical', 'Critical'), ('high', 'High'), ('medium', 'Medium'), ('low', 'Low')
    ], db_index=True)
    source_ip = models.GenericIPAddressField(null=True, blank=True)
    destination_ip = models.GenericIPAddressField(null=True, blank=True)
    user_id = models.IntegerField(null=True, blank=True)
    user_email = models.EmailField(null=True, blank=True)
    resource = models.CharField(max_length=255, null=True, blank=True)
    action = models.CharField(max_length=100)
    details = models.JSONField(default=dict)
    risk_score = models.FloatField(default=0.0)
    is_anomaly = models.BooleanField(default=False, db_index=True)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    processed = models.BooleanField(default=False)

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['tenant', '-timestamp']),
            models.Index(fields=['tenant', 'event_type', '-timestamp']),
        ]

    def __str__(self):
        return f"{self.event_type} - {self.action} - {self.timestamp}"


class SecurityMetric(models.Model):
    """Security metrics and KPIs"""
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='security_metrics',
        null=True,
        blank=True
    )
    METRIC_TYPES = [
        ('mttd', 'Mean Time To Detect'),
        ('mttr', 'Mean Time To Respond'),
        ('mttr_resolve', 'Mean Time To Resolve'),
        ('threat_count', 'Threat Count'),
        ('incident_rate', 'Incident Rate'),
        ('false_positive_rate', 'False Positive Rate'),
        ('coverage', 'Security Coverage'),
        ('compliance_score', 'Compliance Score'),
        ('risk_score', 'Overall Risk Score'),
        ('attack_surface', 'Attack Surface'),
    ]
    metric_type = models.CharField(max_length=50, choices=METRIC_TYPES, db_index=True)
    value = models.FloatField()
    unit = models.CharField(max_length=20, default='count')
    period_start = models.DateTimeField()
    period_end = models.DateTimeField()
    target = models.FloatField(null=True, blank=True)
    trend = models.CharField(max_length=20, choices=[
        ('improving', 'Improving'), ('stable', 'Stable'), ('declining', 'Declining')
    ], default='stable')
    details = models.JSONField(default=dict)
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-recorded_at']
        indexes = [
            models.Index(fields=['tenant', 'metric_type', '-recorded_at']),
        ]

    def __str__(self):
        return f"{self.metric_type}: {self.value} ({self.period_end})"


class RealTimeAlert(models.Model):
    """Real-time alerts for security events"""
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='real_time_alerts',
        null=True,
        blank=True
    )
    ALERT_TYPES = [
        ('threat_detected', 'Threat Detected'),
        ('anomaly_detected', 'Anomaly Detected'),
        ('policy_violation', 'Policy Violation'),
        ('privilege_abuse', 'Privilege Abuse'),
        ('data_exfiltration', 'Data Exfiltration'),
        ('brute_force', 'Brute Force Attempt'),
        ('malware_detected', 'Malware Detected'),
        ('suspicious_login', 'Suspicious Login'),
    ]
    PRIORITY_CHOICES = [
        ('critical', 'Critical'),
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]
    alert_type = models.CharField(max_length=50, choices=ALERT_TYPES, db_index=True)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, db_index=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    source_event = models.ForeignKey(SecurityEvent, on_delete=models.SET_NULL, null=True, blank=True, related_name='alerts')
    user_id = models.IntegerField(null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    asset_affected = models.CharField(max_length=255, null=True, blank=True)
    action_taken = models.JSONField(default=list)
    acknowledged = models.BooleanField(default=False)
    acknowledged_by = models.IntegerField(null=True, blank=True)
    acknowledged_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['tenant', '-created_at']),
            models.Index(fields=['tenant', 'priority', '-created_at']),
        ]

    def __str__(self):
        return f"{self.alert_type} - {self.priority} - {self.created_at}"
