from rest_framework import serializers
from .models import AnomalyDetectionResult

class AnomalyDetectionResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnomalyDetectionResult
        fields = ['id', 'user_id', 'anomaly_type', 'status', 'details', 'timestamp']
