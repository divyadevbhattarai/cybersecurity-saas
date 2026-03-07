from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from security.viewsets import TenantAwareModelViewSet
from security.responses import success_response
from .models import FederatedModel, TrainingJob
from .serializers import FederatedModelSerializer, TrainingJobSerializer
from security.permissions import TenantPermission, RoleBasedPermission, Permission
from security.middleware import TenantContext


class FederatedModelViewSet(TenantAwareModelViewSet):
    serializer_class = FederatedModelSerializer
    permission_classes = (TenantPermission,)
    queryset = FederatedModel.objects.select_related('tenant').all()
    
    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(tenant=TenantContext.get_tenant())
    
    @action(detail=True, methods=['post'])
    def deploy(self, request, pk=None):
        model = self.get_object()
        model.status = 'active'
        model.save()
        return success_response(message='Model deployed')

    @action(detail=True, methods=['post'])
    def archive(self, request, pk=None):
        model = self.get_object()
        model.status = 'archived'
        model.save()
        return success_response(message='Model archived')

    @action(detail=False, methods=['get'])
    def active_models(self, request):
        active_models = self.get_queryset().filter(status='active')
        serializer = self.get_serializer(active_models, many=True)
        return success_response(data=serializer.data)
    
    @action(detail=False, methods=['get'])
    def participants(self, request):
        models = self.get_queryset()
        total_participants = sum(model.participants for model in models)
        return success_response(data={'total_participants': total_participants, 'models_count': models.count()})

    @action(detail=True, methods=['post'])
    def start_training(self, request, pk=None):
        model = self.get_object()
        model.status = 'training'
        model.save()
        
        tenant_id = TenantContext.get_tenant()
        job = TrainingJob.objects.create(
            tenant_id=tenant_id,
            model=model,
            status='running',
            started_at=timezone.now()
        )
        
        return success_response(data={'job_id': job.id}, message='Training started')


class TrainingJobViewSet(TenantAwareModelViewSet):
    serializer_class = TrainingJobSerializer
    permission_classes = (TenantPermission,)
    queryset = TrainingJob.objects.select_related('tenant', 'model').all()
    
    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(tenant=TenantContext.get_tenant())

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        job = self.get_object()
        job.status = 'completed'
        job.completed_at = timezone.now()
        job.accuracy = request.data.get('accuracy', job.accuracy)
        job.save()
        
        job.model.accuracy = job.accuracy
        job.model.status = 'active'
        job.model.participants = job.model.participants + 1
        job.model.save()
        
        return success_response(message='Training completed')

    @action(detail=True, methods=['post'])
    def fail(self, request, pk=None):
        job = self.get_object()
        job.status = 'failed'
        job.completed_at = timezone.now()
        job.save()
        return success_response(message='Training failed')

    @action(detail=False, methods=['get'])
    def running(self, request):
        running_jobs = self.get_queryset().filter(status='running')
        serializer = self.get_serializer(running_jobs, many=True)
        return success_response(data=serializer.data)
