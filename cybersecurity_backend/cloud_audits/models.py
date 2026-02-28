from django.db import models

class CloudAuditResult(models.Model):
    audit_type = models.CharField(max_length=100)  # e.g., 'S3 open bucket check'
    resource_name = models.CharField(max_length=100)  # e.g., 'my-bucket-name'
    status = models.CharField(max_length=50, choices=[('open', 'Open'), ('closed', 'Closed'), ('error', 'Error')])
    details = models.TextField()  # Detailed explanation of the findings
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.audit_type} - {self.resource_name}"
