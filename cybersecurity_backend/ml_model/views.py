from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .anomaly_detection import detect_anomalies_extended

class AIThreatDetectionView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure that the user is authenticated

    def get(self, request):
        # Example: New login data to process (this would come from logs in production)
        login_data = [
            {"user_id": 1, "failed_login_attempts": 5, "geolocation": 'India', "ip_address": '192.168.1.1', "hour_of_access": 3},
            {"user_id": 2, "failed_login_attempts": 0, "geolocation": 'USA', "ip_address": '192.168.1.2', "hour_of_access": 10},
        ]

        # Detect anomalies using the extended features
        anomalies = detect_anomalies_extended(login_data)

        # Return the anomalies detected
        return Response({"anomalies": anomalies}, status=200)
