from rest_framework import serializers
from security.serializers import SanitizedModelSerializer
from .models import Breach


class BreachSerializer(SanitizedModelSerializer):
    class Meta:
        model = Breach
        fields = ['id', 'name', 'description', 'date_detected', 'status']
