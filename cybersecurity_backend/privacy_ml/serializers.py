from rest_framework import serializers
from security.serializers import SanitizedModelSerializer, BaseModelSerializer
from .models import FederatedModel, TrainingJob


class FederatedModelSerializer(SanitizedModelSerializer):
    class Meta:
        model = FederatedModel
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class TrainingJobSerializer(SanitizedModelSerializer):
    model_name = serializers.CharField(required=False, write_only=True)
    
    class Meta:
        model = TrainingJob
        fields = ['id', 'model', 'model_name', 'status', 'rounds', 'accuracy', 
                  'started_at', 'completed_at']
        read_only_fields = ['started_at', 'completed_at', 'model', 'accuracy']
        extra_kwargs = {
            'rounds': {'required': False},
            'status': {'required': False},
        }
    
    def create(self, validated_data):
        model_name = validated_data.pop('model_name', 'Default Model')
        model_id = validated_data.pop('model_id', None)
        
        if not model_id:
            tenant_id = self.context['request'].user.tenant_id if hasattr(self.context['request'].user, 'tenant_id') else None
            model, _ = FederatedModel.objects.get_or_create(
                tenant_id=tenant_id,
                name=model_name,
                defaults={'version': '1.0', 'status': 'training', 'accuracy': 0.0, 'participants': 0}
            )
            validated_data['model'] = model
        else:
            try:
                validated_data['model'] = FederatedModel.objects.get(id=model_id)
            except FederatedModel.DoesNotExist:
                validated_data['model'] = None
        
        if 'status' not in validated_data or not validated_data.get('status'):
            validated_data['status'] = 'pending'
        if 'rounds' not in validated_data or not validated_data.get('rounds'):
            validated_data['rounds'] = 0
        return super().create(validated_data)
