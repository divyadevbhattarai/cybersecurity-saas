from django.db import models
from django.contrib.auth import get_user_model
from users.models import Tenant

User = get_user_model()


class SBOMProject(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='sbom_projects',
        null=True,
        blank=True
    )
    name = models.CharField(max_length=255)
    description = models.TextField()
    version = models.CharField(max_length=50)
    repository_url = models.URLField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.version})"


class SBOMComponent(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='sbom_components',
        null=True,
        blank=True
    )
    project = models.ForeignKey(SBOMProject, on_delete=models.CASCADE, related_name='components')
    name = models.CharField(max_length=255)
    version = models.CharField(max_length=100)
    package_type = models.CharField(max_length=50)
    supplier = models.CharField(max_length=255, blank=True)
    license = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    purl = models.CharField(max_length=500, blank=True)
    cpe = models.CharField(max_length=200, blank=True)
    is_direct_dependency = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name}@{self.version}"


class Vulnerability(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='sbom_vulnerabilities',
        null=True,
        blank=True
    )
    SEVERITY_CHOICES = [
        ('critical', 'Critical'),
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
        ('none', 'None'),
    ]
    
    cve_id = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    cvss_score = models.FloatField(null=True, blank=True)
    affected_versions = models.JSONField(default=list)
    fixed_versions = models.JSONField(default=list)
    references = models.JSONField(default=list)
    published_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.cve_id


class ComponentVulnerability(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='component_vulnerabilities',
        null=True,
        blank=True
    )
    component = models.ForeignKey(SBOMComponent, on_delete=models.CASCADE, related_name='vulnerabilities')
    vulnerability = models.ForeignKey(Vulnerability, on_delete=models.CASCADE, related_name='affected_components')
    status = models.CharField(max_length=50, default='open')
    remediation_status = models.CharField(max_length=50, default='pending')
    notes = models.TextField(blank=True)
    detected_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.component.name} - {self.vulnerability.cve_id}"
