from rest_framework import serializers
from security.serializers import SanitizedModelSerializer, BaseModelSerializer
from .models import FederatedModel, TrainingJob


class FederatedModelSerializer(SanitizedModelSerializer):
    class Meta:
        model = FederatedModel
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class TrainingJobSerializer(SanitizedModelSerializer):
    model_name = serializers.CharField(source='model.name', read_only=True)

    class Meta:
        model = TrainingJob
        fields = '__all__'
        read_only_fields = ['started_at', 'completed_at']
