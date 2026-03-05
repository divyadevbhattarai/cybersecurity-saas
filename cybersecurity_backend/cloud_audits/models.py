from django.db import models


class CloudAuditResult(models.Model):
    tenant = models.ForeignKey(
        'users.Tenant',
        on_delete=models.CASCADE,
        related_name='cloud_audits',
        null=True,
        blank=True
    )
    audit_type = models.CharField(max_length=100)
    resource_name = models.CharField(max_length=100)
    status = models.CharField(max_length=50, choices=[('open', 'Open'), ('closed', 'Closed'), ('error', 'Error')])
    details = models.TextField()
    severity = models.CharField(
        max_length=20,
        choices=[
            ('critical', 'Critical'),
            ('high', 'High'),
            ('medium', 'Medium'),
            ('low', 'Low'),
        ],
        default='medium'
    )
    cloud_provider = models.CharField(max_length=50, blank=True)
    resource_arn = models.CharField(max_length=500, blank=True)
    remediation_steps = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.audit_type} - {self.resource_name}"
