from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from breaches.models import Breach
from ztna.models import BiometricProfile, ZTNAProfile, AccessRequest
from soar.models import Playbook, PlaybookRun, SecurityAgent, Webhook
from cloud_audits.models import CloudAuditResult
from ml_model.models import AnomalyDetectionResult

User = get_user_model()


class Command(BaseCommand):
    help = 'Populate the database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Creating seed data...')

        user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@example.com',
                'first_name': 'Admin',
                'last_name': 'User',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            user.set_password('admin123')
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Created user: {user.username}'))

        user2, created = User.objects.get_or_create(
            username='analyst',
            defaults={
                'email': 'analyst@example.com',
                'first_name': 'Security',
                'last_name': 'Analyst',
            }
        )
        if created:
            user2.set_password('analyst123')
            user2.save()
            self.stdout.write(self.style.SUCCESS(f'Created user: {user2.username}'))

        breaches_data = [
            {'name': 'SQL Injection Attack', 'description': 'Detected SQL injection in login form', 'status': 'open'},
            {'name': 'Data Leak - Customer DB', 'description': 'Customer database exposed via misconfigured S3 bucket', 'status': 'open'},
            {'name': 'Phishing Campaign', 'description': 'Targeted phishing emails sent to employees', 'status': 'resolved'},
            {'name': 'Ransomware Incident', 'description': 'Encrypted files on dev server - recovered from backup', 'status': 'resolved'},
            {'name': 'API Key Exposure', 'description': 'AWS keys found in public GitHub repository', 'status': 'resolved'},
        ]
        for breach_data in breaches_data:
            breach, created = Breach.objects.get_or_create(
                name=breach_data['name'],
                defaults=breach_data
            )
            if created:
                self.stdout.write(f'Created breach: {breach.name}')

        ztna_profile, created = ZTNAProfile.objects.get_or_create(
            user=user,
            device_id='device-001',
            defaults={
                'ip_address': '192.168.1.100',
                'device_fingerprint': 'abc123def456',
                'trust_score': 85.0,
                'access_level': 'high',
                'is_trusted': True,
                'risk_level': 'low',
                'session_active': True,
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created ZTNA profile for {user.username}'))

        biometric, created = BiometricProfile.objects.get_or_create(
            user=user,
            device_id='device-001',
            defaults={
                'device_type': 'laptop',
                'keystroke_pattern': {'avg_keystroke': 120, 'variance': 15},
                'mouse_movement_pattern': {'avg_speed': 45},
                'behavioral_score': 95.0,
                'is_verified': True,
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created biometric profile for {user.username}'))

        access_request, created = AccessRequest.objects.get_or_create(
            user=user2,
            resource='Production Database',
            defaults={
                'access_level': 'high',
                'justification': 'Need access for quarterly audit',
                'status': 'approved',
                'approved_by': user,
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created access request for {user2.username}'))

        playbook_data = [
            {
                'name': 'Malware Response Playbook',
                'description': 'Automated response to detected malware',
                'trigger_type': 'automatic',
                'status': 'active',
                'priority': 1,
                'estimated_duration': 15,
                'actions': ['isolate_host', 'alert_security_team', 'collect_evidence'],
                'conditions': ['malware_detected == true'],
            },
            {
                'name': 'Failed Login Investigation',
                'description': 'Investigate accounts with multiple failed logins',
                'trigger_type': 'automatic',
                'status': 'active',
                'priority': 2,
                'estimated_duration': 10,
                'actions': ['notify_user', 'temporarily_lock', 'log_incident'],
                'conditions': ['failed_logins > 5'],
            },
            {
                'name': 'Data Exfiltration Alert',
                'description': 'Response to potential data exfiltration',
                'trigger_type': 'automatic',
                'status': 'active',
                'priority': 1,
                'estimated_duration': 20,
                'actions': ['block_transfer', 'alert_dpo', 'preserve_logs'],
                'conditions': ['unusual_data_transfer == true'],
            },
        ]
        for pb_data in playbook_data:
            playbook, created = Playbook.objects.get_or_create(
                name=pb_data['name'],
                defaults={**pb_data, 'created_by': user}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created playbook: {playbook.name}'))

        agent_data = [
            {'name': 'Network Monitor', 'agent_type': 'monitoring', 'status': 'active', 'description': 'Monitors network traffic for anomalies'},
            {'name': 'Endpoint Remediation', 'agent_type': 'remediation', 'status': 'active', 'description': 'Automatically remediates endpoint issues'},
            {'name': 'Threat Hunter', 'agent_type': 'threat_hunting', 'status': 'active', 'description': 'Proactively hunts for threats'},
        ]
        for agent_info in agent_data:
            agent, created = SecurityAgent.objects.get_or_create(
                name=agent_info['name'],
                defaults={**agent_info, 'created_by': user}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created agent: {agent.name}'))

        webhook, created = Webhook.objects.get_or_create(
            name='Slack Security Alerts',
            defaults={
                'url': 'https://hooks.slack.com/services/xxx',
                'headers': {'Content-Type': 'application/json'},
                'events': ['breach_detected', 'anomaly_detected'],
                'is_active': True,
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created webhook: {webhook.name}'))

        audit_data = [
            {'audit_type': 'S3 Bucket Check', 'resource_name': 'production-data-bucket', 'status': 'closed', 'details': 'Bucket is properly configured with encryption and access controls'},
            {'audit_type': 'S3 Bucket Check', 'resource_name': 'backup-bucket-2024', 'status': 'open', 'details': 'Bucket allows public read access - requires immediate attention'},
            {'audit_type': 'IAM Role Check', 'resource_name': 'lambda-execution-role', 'status': 'closed', 'details': 'Role follows least privilege principle'},
            {'audit_type': 'KMS Encryption Check', 'resource_name': 'customer-data-key', 'status': 'closed', 'details': 'Key rotation enabled, all resources encrypted'},
            {'audit_type': 'CloudTrail Check', 'resource_name': 'main-trail', 'status': 'closed', 'details': 'CloudTrail logging enabled across all regions'},
        ]
        for audit_info in audit_data:
            audit, created = CloudAuditResult.objects.get_or_create(
                audit_type=audit_info['audit_type'],
                resource_name=audit_info['resource_name'],
                defaults=audit_info
            )
            if created:
                self.stdout.write(f'Created cloud audit: {audit.audit_type} - {audit.resource_name}')

        anomaly_data = [
            {'user_id': 1, 'anomaly_type': 'Unusual Login Location', 'status': 'detected', 'details': 'User logged in from unusual geographic location'},
            {'user_id': 2, 'anomaly_type': 'Multiple Failed Logins', 'status': 'resolved', 'details': 'Account locked after 10 failed attempts'},
            {'user_id': 1, 'anomaly_type': 'Data Exfiltration Attempt', 'status': 'detected', 'details': 'Large data transfer to external IP detected'},
            {'user_id': 2, 'anomaly_type': 'Privilege Escalation', 'status': 'detected', 'details': 'User attempted to access admin resources'},
        ]
        for anomaly_info in anomaly_data:
            anomaly, created = AnomalyDetectionResult.objects.get_or_create(
                user_id=anomaly_info['user_id'],
                anomaly_type=anomaly_info['anomaly_type'],
                status=anomaly_info['status'],
                defaults={'details': anomaly_info['details']}
            )
            if created:
                self.stdout.write(f'Created anomaly: {anomaly.anomaly_type}')

        self.stdout.write(self.style.SUCCESS('Seed data created successfully!'))
        self.stdout.write('')
        self.stdout.write('Test accounts:')
        self.stdout.write('  Username: admin, Password: admin123')
        self.stdout.write('  Username: analyst, Password: analyst123')
