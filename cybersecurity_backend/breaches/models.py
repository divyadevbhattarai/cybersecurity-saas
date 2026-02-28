from django.db import models

# Create your models here.
from django.db import models

class Breach(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    date_detected = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[('open', 'Open'), ('resolved', 'Resolved')])

    def __str__(self):
        return self.name
