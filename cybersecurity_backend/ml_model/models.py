from django.db import models
from users.models import Tenant


class AnomalyDetectionResult(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='anomaly_results',
        null=True,
        blank=True
    )
    user_id = models.IntegerField()  # The ID of the user associated with the anomaly
    anomaly_type = models.CharField(max_length=255)  # Type of anomaly detected (e.g., 'Unusual login')
    status = models.CharField(max_length=50, choices=[('detected', 'Detected'), ('resolved', 'Resolved')], default='detected')  # Whether the anomaly is detected or resolved
    details = models.TextField()  # Detailed description of the anomaly (e.g., "User logged in from an unusual location")
    timestamp = models.DateTimeField(auto_now_add=True)  # Timestamp when the anomaly was detected

    def __str__(self):
        return f"Anomaly for User {self.user_id} - {self.anomaly_type}"
