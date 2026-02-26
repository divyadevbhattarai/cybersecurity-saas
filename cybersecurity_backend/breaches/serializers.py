from rest_framework import serializers
from .models import Breach

class BreachSerializer(serializers.ModelSerializer):
    class Meta:
        model = Breach
        fields = ['id', 'name', 'description', 'date_detected', 'status']
