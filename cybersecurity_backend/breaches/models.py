from django.db import models
from django.conf import settings


class Breach(models.Model):
    tenant = models.ForeignKey(
        'users.Tenant',
        on_delete=models.CASCADE,
        related_name='breaches',
        null=True,
        blank=True
    )
    name = models.CharField(max_length=100, db_index=True)
    description = models.TextField()
    date_detected = models.DateTimeField(auto_now_add=True, db_index=True)
    status = models.CharField(max_length=20, choices=[('open', 'Open'), ('resolved', 'Resolved')], db_index=True)
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
    affected_systems = models.JSONField(default=list)
    remediation_steps = models.TextField(blank=True)

    class Meta:
        ordering = ['-date_detected']
    
    def __str__(self):
        return self.name
