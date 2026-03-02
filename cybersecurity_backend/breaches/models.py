from django.db import models

class Breach(models.Model):
    name = models.CharField(max_length=100, db_index=True)
    description = models.TextField()
    date_detected = models.DateTimeField(auto_now_add=True, db_index=True)
    status = models.CharField(max_length=20, choices=[('open', 'Open'), ('resolved', 'Resolved')], db_index=True)

    def __str__(self):
        return self.name
