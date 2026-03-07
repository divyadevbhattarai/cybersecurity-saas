from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from security.responses import success_response, error_response
from security.permissions import TenantPermission, RoleBasedPermission, Permission
from security.middleware import TenantContext
from .anomaly_detection import detect_anomalies_extended
from .models import AnomalyDetectionResult, ThreatIntelligence, ThreatPrediction, SecurityIncident, SecurityEvent, SecurityMetric, RealTimeAlert
from .serializers import (
    AnomalyDetectionResultSerializer,
    ThreatIntelligenceSerializer,
    ThreatPredictionSerializer,
    SecurityIncidentSerializer,
    SecurityEventSerializer,
    SecurityMetricSerializer,
    RealTimeAlertSerializer
)
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random


class AIThreatDetectionView(APIView):
    permission_classes = (TenantPermission,)

    def get(self, request):
        login_data = [
            {"user_id": 1, "failed_login_attempts": 5, "geolocation": 'India', "ip_address": '192.168.1.1', "hour_of_access": 3},
            {"user_id": 2, "failed_login_attempts": 0, "geolocation": 'USA', "ip_address": '192.168.1.2', "hour_of_access": 10},
        ]

        anomalies = detect_anomalies_extended(login_data)

        return success_response(data={"anomalies": anomalies})


class AdvancedThreatDetectionView(APIView):
    permission_classes = [TenantPermission, RoleBasedPermission([Permission.VIEW_THREATS], require_all=False)]

    def post(self, request):
        event_type = request.data.get('event_type')
        ip_address = request.data.get('ip_address')
        user_agent = request.data.get('user_agent')
        location = request.data.get('location', {})
        timestamp = request.data.get('timestamp', datetime.now().isoformat())

        threat_score = self._calculate_threat_score(event_type, ip_address, user_agent, location)
        risk_level = self._determine_risk_level(threat_score)
        recommendations = self._get_recommendations(threat_score, event_type)
        anomaly_type = self._classify_anomaly(event_type, threat_score)
        automated_action = self._determine_automated_action(threat_score, risk_level)

        result = {
            'threat_score': threat_score,
            'risk_level': risk_level,
            'recommendations': recommendations,
            'ai_confidence': round(random.uniform(0.85, 0.99), 2),
            'anomaly_type': anomaly_type,
            'automated_action': automated_action
        }

        tenant_id = TenantContext.get_tenant()
        SecurityIncident.objects.create(
            tenant_id=tenant_id,
            incident_type=anomaly_type,
            status='open',
            severity=risk_level,
            title=f"{anomaly_type.replace('_', ' ').title()} Detected",
            description=f"Threat detected from IP {ip_address}",
            source='AI Threat Detection',
            indicators=[ip_address],
            ai_confidence=result['ai_confidence'],
            automated_action=automated_action
        )

        return success_response(data=result, message='Threat analysis completed')

    def _calculate_threat_score(self, event_type, ip_address, user_agent, location):
        score = 0.0
        if event_type in ['login_attempt', 'credential_stuffing', 'brute_force']:
            score += 30
        if event_type == 'unusual_location':
            score += 25
        if event_type == 'impossible_travel':
            score += 50
        if any(x in ip_address.lower() for x in ['tor', 'vpn', 'proxy']):
            score += 20
        if location.get('country') in ['RU', 'CN', 'KP', 'IR', 'SY']:
            score += 15
        if user_agent and len(user_agent) < 20:
            score += 10
        return min(score + random.uniform(0, 20), 100)

    def _determine_risk_level(self, score):
        if score >= 80:
            return 'CRITICAL'
        elif score >= 60:
            return 'HIGH'
        elif score >= 40:
            return 'MEDIUM'
        else:
            return 'LOW'

    def _get_recommendations(self, score, event_type):
        recommendations = []
        if score >= 60:
            recommendations.append('Require additional MFA verification')
            recommendations.append('Flag account for review')
        if score >= 80:
            recommendations.append('Immediately block IP address')
            recommendations.append('Enable session monitoring')
        if event_type in ['credential_stuffing', 'brute_force']:
            recommendations.append('Implement rate limiting')
            recommendations.append('Enable account lockout')
        if not recommendations:
            recommendations.append('Continue monitoring')
        return recommendations

    def _classify_anomaly(self, event_type, score):
        if score >= 80:
            return 'intrusion'
        elif event_type == 'credential_stuffing':
            return 'credential_stuffing'
        elif event_type == 'brute_force':
            return 'brute_force'
        elif event_type == 'unusual_location':
            return 'unusual_location'
        else:
            return 'suspicious_activity'

    def _determine_automated_action(self, score, risk_level):
        if score >= 80:
            return 'block_ip'
        elif score >= 60:
            return 'challenge_mfa'
        elif score >= 40:
            return 'increase_monitoring'
        return 'none'


class ThreatIntelligenceView(APIView):
    permission_classes = [TenantPermission, RoleBasedPermission([Permission.VIEW_THREATS], require_all=False)]

    def get(self, request):
        threat_type = request.query_params.get('type')
        severity = request.query_params.get('severity')
        is_active = request.query_params.get('is_active', 'true').lower() == 'true'

        queryset = ThreatIntelligence.objects.filter(is_active=is_active)
        if threat_type:
            queryset = queryset.filter(threat_type=threat_type)
        if severity:
            queryset = queryset.filter(severity=severity)

        serializer = ThreatIntelligenceSerializer(queryset[:100], many=True)
        return success_response(data={'threats': serializer.data, 'count': queryset.count()})


class ThreatPredictionView(APIView):
    permission_classes = [TenantPermission, RoleBasedPermission([Permission.VIEW_THREATS], require_all=False)]

    def get(self, request):
        prediction_type = request.query_params.get('type')
        queryset = ThreatPrediction.objects.all()
        if prediction_type:
            queryset = queryset.filter(prediction_type=prediction_type)

        serializer = ThreatPredictionSerializer(queryset[:50], many=True)
        return success_response(data={'predictions': serializer.data, 'count': queryset.count()})

    def post(self, request):
        prediction_type = request.data.get('prediction_type', 'risk_score')
        target = request.data.get('target')

        prediction_data = self._generate_prediction(prediction_type, target)

        tenant_id = TenantContext.get_tenant()
        threat_prediction = ThreatPrediction.objects.create(
            tenant_id=tenant_id,
            prediction_type=prediction_type,
            target=target,
            prediction=prediction_data['prediction'],
            confidence=prediction_data['confidence'],
            risk_level=prediction_data['risk_level'],
            factors=prediction_data['factors'],
            recommendations=prediction_data['recommendations'],
            model_version='v2.1.0',
            valid_until=datetime.now() + timedelta(hours=24)
        )

        serializer = ThreatPredictionSerializer(threat_prediction)
        return success_response(data=serializer.data, message='Threat prediction generated')

    def _generate_prediction(self, prediction_type, target):
        if prediction_type == 'breach_likelihood':
            likelihood = random.uniform(0.05, 0.35)
            return {
                'prediction': {'breach_probability': likelihood},
                'confidence': round(random.uniform(0.75, 0.95), 2),
                'risk_level': 'HIGH' if likelihood > 0.25 else 'MEDIUM' if likelihood > 0.15 else 'LOW',
                'factors': {
                    'vulnerability_count': random.randint(5, 50),
                    'exploit_activity': random.randint(0, 100),
                    'threat_actors': random.randint(1, 10)
                },
                'recommendations': [
                    'Patch critical vulnerabilities',
                    'Enable enhanced monitoring',
                    'Review access controls'
                ]
            }
        elif prediction_type == 'attack_vector':
            vectors = ['phishing', 'malware', 'api_attack', 'supply_chain', 'insider']
            return {
                'prediction': {'likely_vector': random.choice(vectors), 'probability': random.uniform(0.6, 0.9)},
                'confidence': round(random.uniform(0.70, 0.90), 2),
                'risk_level': 'HIGH',
                'factors': {'recent_attempts': random.randint(0, 50), 'sector_targeted': True},
                'recommendations': [
                    'Implement email filtering',
                    'Update endpoint protection',
                    'Review API security'
                ]
            }
        else:
            risk_score = random.randint(20, 80)
            return {
                'prediction': {'risk_score': risk_score},
                'confidence': round(random.uniform(0.80, 0.95), 2),
                'risk_level': 'HIGH' if risk_score > 60 else 'MEDIUM' if risk_score > 40 else 'LOW',
                'factors': {'threat_count': random.randint(0, 200), 'open_incidents': random.randint(0, 10)},
                'recommendations': ['Continue monitoring', 'Review security policies']
            }


class SecurityIncidentView(APIView):
    permission_classes = [TenantPermission, RoleBasedPermission([Permission.VIEW_THREATS], require_all=False)]

    def get(self, request):
        incident_status = request.query_params.get('status')
        severity = request.query_params.get('severity')

        queryset = SecurityIncident.objects.all()
        if incident_status:
            queryset = queryset.filter(status=incident_status)
        if severity:
            queryset = queryset.filter(severity=severity)

        serializer = SecurityIncidentSerializer(queryset[:100], many=True)
        return success_response(data={'incidents': serializer.data, 'count': queryset.count()})

    def post(self, request):
        serializer = SecurityIncidentSerializer(data=request.data)
        if serializer.is_valid():
            tenant_id = TenantContext.get_tenant()
            serializer.save(tenant_id=tenant_id)
            return success_response(data=serializer.data, message='Incident created', status=status.HTTP_201_CREATED)
        return error_response('Invalid data', 'VALIDATION_ERROR', status.HTTP_400_BAD_REQUEST, serializer.errors)


class IncidentDetailView(APIView):
    permission_classes = [TenantPermission, RoleBasedPermission([Permission.VIEW_THREATS], require_all=False)]

    def get(self, request, pk):
        try:
            incident = SecurityIncident.objects.get(pk=pk)
            serializer = SecurityIncidentSerializer(incident)
            return success_response(data=serializer.data)
        except SecurityIncident.DoesNotExist:
            return error_response('Incident not found', 'NOT_FOUND', status.HTTP_404_NOT_FOUND)

    def patch(self, request, pk):
        try:
            incident = SecurityIncident.objects.get(pk=pk)
            serializer = SecurityIncidentSerializer(incident, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return success_response(data=serializer.data, message='Incident updated')
            return error_response('Invalid data', 'VALIDATION_ERROR', status.HTTP_400_BAD_REQUEST, serializer.errors)
        except SecurityIncident.DoesNotExist:
            return error_response('Incident not found', 'NOT_FOUND', status.HTTP_404_NOT_FOUND)


class DashboardMetricsView(APIView):
    permission_classes = [TenantPermission, RoleBasedPermission([Permission.VIEW_DASHBOARD], require_all=False)]

    def get(self, request):
        total_incidents = SecurityIncident.objects.count()
        open_incidents = SecurityIncident.objects.filter(status='open').count()
        critical_incidents = SecurityIncident.objects.filter(severity='critical', status__in=['open', 'investigating']).count()
        avg_threat_score = random.uniform(25, 45)

        severity_breakdown = {
            'critical': SecurityIncident.objects.filter(severity='critical').count(),
            'high': SecurityIncident.objects.filter(severity='high').count(),
            'medium': SecurityIncident.objects.filter(severity='medium').count(),
            'low': SecurityIncident.objects.filter(severity='low').count(),
        }

        status_breakdown = {
            'open': SecurityIncident.objects.filter(status='open').count(),
            'investigating': SecurityIncident.objects.filter(status='investigating').count(),
            'contained': SecurityIncident.objects.filter(status='contained').count(),
            'remediated': SecurityIncident.objects.filter(status='remediated').count(),
            'closed': SecurityIncident.objects.filter(status='closed').count(),
        }

        return success_response(data={
            'total_incidents': total_incidents,
            'open_incidents': open_incidents,
            'critical_incidents': critical_incidents,
            'avg_threat_score': round(avg_threat_score, 2),
            'severity_breakdown': severity_breakdown,
            'status_breakdown': status_breakdown,
            'threat_trend': [random.randint(10, 50) for _ in range(7)]
        })


class SecurityEventView(APIView):
    permission_classes = [TenantPermission, RoleBasedPermission([Permission.VIEW_LOGS], require_all=False)]

    def get(self, request):
        event_type = request.query_params.get('type')
        severity = request.query_params.get('severity')
        is_anomaly = request.query_params.get('anomaly')

        queryset = SecurityEvent.objects.all()
        if event_type:
            queryset = queryset.filter(event_type=event_type)
        if severity:
            queryset = queryset.filter(severity=severity)
        if is_anomaly:
            queryset = queryset.filter(is_anomaly=is_anomaly.lower() == 'true')

        serializer = SecurityEventSerializer(queryset[:200], many=True)
        return success_response(data={'events': serializer.data, 'count': queryset.count()})

    def post(self, request):
        serializer = SecurityEventSerializer(data=request.data)
        if serializer.is_valid():
            tenant_id = TenantContext.get_tenant()
            event = serializer.save(tenant_id=tenant_id)

            if event.risk_score >= 70 or event.is_anomaly:
                RealTimeAlert.objects.create(
                    tenant_id=tenant_id,
                    alert_type='anomaly_detected' if event.is_anomaly else 'threat_detected',
                    priority='critical' if event.risk_score >= 80 else 'high' if event.risk_score >= 60 else 'medium',
                    title=f"High Risk Event: {event.event_type}",
                    description=f"Security event with risk score {event.risk_score}",
                    source_event=event,
                    user_id=event.user_id,
                    ip_address=event.source_ip,
                    asset_affected=event.resource
                )

            return success_response(data=serializer.data, message='Event logged', status=status.HTTP_201_CREATED)
        return error_response('Invalid data', 'VALIDATION_ERROR', status.HTTP_400_BAD_REQUEST, serializer.errors)


class SecurityMetricsView(APIView):
    permission_classes = [TenantPermission, RoleBasedPermission([Permission.VIEW_DASHBOARD], require_all=False)]

    def get(self, request):
        metric_type = request.query_params.get('type')

        queryset = SecurityMetric.objects.all()
        if metric_type:
            queryset = queryset.filter(metric_type=metric_type)

        serializer = SecurityMetricSerializer(queryset[:100], many=True)
        return success_response(data={'metrics': serializer.data, 'count': queryset.count()})

    def post(self, request):
        serializer = SecurityMetricSerializer(data=request.data)
        if serializer.is_valid():
            tenant_id = TenantContext.get_tenant()
            serializer.save(tenant_id=tenant_id)
            return success_response(data=serializer.data, message='Metric recorded', status=status.HTTP_201_CREATED)
        return error_response('Invalid data', 'VALIDATION_ERROR', status.HTTP_400_BAD_REQUEST, serializer.errors)


class RealTimeAlertsView(APIView):
    permission_classes = [TenantPermission, RoleBasedPermission([Permission.VIEW_ALERTS], require_all=False)]

    def get(self, request):
        priority = request.query_params.get('priority')
        acknowledged = request.query_params.get('acknowledged')

        queryset = RealTimeAlert.objects.all()
        if priority:
            queryset = queryset.filter(priority=priority)
        if acknowledged is not None:
            queryset = queryset.filter(acknowledged=acknowledged.lower() == 'true')

        serializer = RealTimeAlertSerializer(queryset[:100], many=True)
        return success_response(data={'alerts': serializer.data, 'count': queryset.count()})

    def post(self, request):
        serializer = RealTimeAlertSerializer(data=request.data)
        if serializer.is_valid():
            tenant_id = TenantContext.get_tenant()
            serializer.save(tenant_id=tenant_id)
            return success_response(data=serializer.data, message='Alert created', status=status.HTTP_201_CREATED)
        return error_response('Invalid data', 'VALIDATION_ERROR', status.HTTP_400_BAD_REQUEST, serializer.errors)


class AlertAcknowledgeView(APIView):
    permission_classes = [TenantPermission, RoleBasedPermission([Permission.MANAGE_ALERTS], require_all=False)]

    def post(self, request, pk):
        try:
            alert = RealTimeAlert.objects.get(pk=pk)
            alert.acknowledged = True
            alert.acknowledged_by = request.user.id
            alert.acknowledged_at = datetime.now()
            alert.save()
            serializer = RealTimeAlertSerializer(alert)
            return success_response(data=serializer.data, message='Alert acknowledged')
        except RealTimeAlert.DoesNotExist:
            return error_response('Alert not found', 'NOT_FOUND', status.HTTP_404_NOT_FOUND)


class AnalyticsDashboardView(APIView):
    permission_classes = [TenantPermission, RoleBasedPermission([Permission.VIEW_DASHBOARD], require_all=False)]

    def get(self, request):
        now = datetime.now()
        last_24h = now - timedelta(hours=24)
        last_7d = now - timedelta(days=7)
        last_30d = now - timedelta(days=30)

        events_24h = SecurityEvent.objects.filter(timestamp__gte=last_24h).count()
        events_7d = SecurityEvent.objects.filter(timestamp__gte=last_7d).count()
        events_30d = SecurityEvent.objects.filter(timestamp__gte=last_30d).count()

        anomalies_24h = SecurityEvent.objects.filter(timestamp__gte=last_24h, is_anomaly=True).count()
        alerts_24h = RealTimeAlert.objects.filter(created_at__gte=last_24h).count()
        unacknowledged_alerts = RealTimeAlert.objects.filter(acknowledged=False).count()

        critical_alerts = RealTimeAlert.objects.filter(priority='critical', acknowledged=False).count()
        high_alerts = RealTimeAlert.objects.filter(priority='high', acknowledged=False).count()

        event_types = {}
        for event_type, _ in SecurityEvent.EVENT_TYPES:
            count = SecurityEvent.objects.filter(event_type=event_type, timestamp__gte=last_7d).count()
            event_types[event_type] = count

        hourly_events = []
        for i in range(24):
            hour_start = now - timedelta(hours=i+1)
            hour_end = now - timedelta(hours=i)
            count = SecurityEvent.objects.filter(timestamp__gte=hour_start, timestamp__lt=hour_end).count()
            hourly_events.append({'hour': i, 'count': count})
        hourly_events.reverse()

        return success_response(data={
            'summary': {
                'events_24h': events_24h,
                'events_7d': events_7d,
                'events_30d': events_30d,
                'anomalies_24h': anomalies_24h,
                'alerts_24h': alerts_24h,
                'unacknowledged_alerts': unacknowledged_alerts,
                'critical_alerts': critical_alerts,
                'high_alerts': high_alerts,
            },
            'event_types': event_types,
            'hourly_events': hourly_events,
            'active_threats': SecurityIncident.objects.filter(status__in=['open', 'investigating']).count(),
            'threat_intelligence_count': ThreatIntelligence.objects.filter(is_active=True).count(),
        })


class GenerateSampleDataView(APIView):
    permission_classes = [TenantPermission, RoleBasedPermission([Permission.VIEW_DASHBOARD], require_all=False)]

    def post(self, request):
        tenant_id = TenantContext.get_tenant()
        created_events = 0

        event_types = ['login', 'logout', 'file_access', 'network_connection', 'privilege_change', 'failed_auth', 'suspicious_activity']
        ips = ['192.168.1.100', '10.0.0.50', '172.16.0.25', '203.0.113.1', '198.51.100.2']

        for _ in range(50):
            event = SecurityEvent.objects.create(
                tenant_id=tenant_id,
                event_type=random.choice(event_types),
                severity=random.choice(['critical', 'high', 'medium', 'low']),
                source_ip=random.choice(ips),
                destination_ip=random.choice(ips),
                user_id=random.randint(1, 10),
                user_email=f"user{random.randint(1, 10)}@example.com",
                action=f"action_{random.randint(1, 100)}",
                details={'device': random.choice(['laptop', 'mobile', 'desktop'])},
                risk_score=random.uniform(0, 100),
                is_anomaly=random.random() < 0.2
            )
            created_events += 1

            if event.risk_score >= 70:
                RealTimeAlert.objects.create(
                    tenant_id=tenant_id,
                    alert_type='threat_detected',
                    priority='critical' if event.risk_score >= 80 else 'high',
                    title=f"High Risk Event: {event.event_type}",
                    description=f"Risk score: {event.risk_score:.1f}",
                    source_event=event,
                    user_id=event.user_id,
                    ip_address=event.source_ip
                )

        SecurityMetric.objects.create(
            tenant_id=tenant_id,
            metric_type='threat_count',
            value=created_events,
            unit='count',
            period_start=datetime.now() - timedelta(hours=1),
            period_end=datetime.now(),
            trend='stable',
            details={'period': '1h'}
        )

        return success_response(message=f'Generated {created_events} sample security events')
