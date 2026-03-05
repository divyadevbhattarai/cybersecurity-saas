from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from security.responses import success_response
from .anomaly_detection import detect_anomalies_extended
from security.permissions import TenantPermission, RoleBasedPermission, Permission


class AIThreatDetectionView(APIView):
    permission_classes = (TenantPermission,)

    def get(self, request):
        login_data = [
            {"user_id": 1, "failed_login_attempts": 5, "geolocation": 'India', "ip_address": '192.168.1.1', "hour_of_access": 3},
            {"user_id": 2, "failed_login_attempts": 0, "geolocation": 'USA', "ip_address": '192.168.1.2', "hour_of_access": 10},
        ]

        anomalies = detect_anomalies_extended(login_data)

        return success_response(data={"anomalies": anomalies})
