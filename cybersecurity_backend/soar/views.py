from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from security.viewsets import TenantAwareModelViewSet
from security.responses import success_response, error_response
from .models import Playbook, PlaybookRun, SecurityAgent, Webhook
from .serializers import PlaybookSerializer, PlaybookRunSerializer, SecurityAgentSerializer, WebhookSerializer
from security.permissions import TenantPermission, RoleBasedPermission, Permission
from security.middleware import TenantContext
import logging

logger = logging.getLogger(__name__)


class PlaybookViewSet(TenantAwareModelViewSet):
    serializer_class = PlaybookSerializer
    permission_classes = [
        TenantPermission,
        RoleBasedPermission([Permission.VIEW_PLAYBOOKS, Permission.MANAGE_PLAYBOOKS], require_all=False),
    ]
    queryset = Playbook.objects.select_related('tenant', 'created_by').all()
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def run(self, request, pk=None):
        playbook = self.get_object()
        
        permission_check = RoleBasedPermission([Permission.EXECUTE_PLAYBOOKS])
        if not permission_check.has_permission(request, self):
            return error_response('Permission denied', 'FORBIDDEN', status.HTTP_403_FORBIDDEN)
        
        run = PlaybookRun.objects.create(
            playbook=playbook,
            triggered_by=request.user,
            tenant_id=playbook.tenant_id,
            status='running',
            started_at=timezone.now()
        )
        
        execution_log = []
        try:
            for action_item in playbook.actions:
                execution_log.append({
                    'action': action_item.get('type'),
                    'status': 'success',
                    'timestamp': timezone.now().isoformat()
                })
            
            run.status = 'completed'
            run.completed_at = timezone.now()
            run.execution_log = execution_log
            run.save()
            
            playbook.last_run = timezone.now()
            playbook.run_count += 1
            playbook.success_count += 1
            playbook.save()
            
            return success_response(
                data={'run_id': run.id, 'status': 'completed', 'log': execution_log}
            )
        except Exception as e:
            run.status = 'failed'
            run.completed_at = timezone.now()
            run.error_message = str(e)
            run.save()
            
            playbook.run_count += 1
            playbook.failure_count += 1
            playbook.save()
            
            return error_response(f'Run failed: {str(e)}', 'EXECUTION_ERROR', status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        playbook = self.get_object()
        playbook.status = 'active' if playbook.status == 'draft' else 'draft'
        playbook.save()
        return success_response(data={'status': playbook.status})


class PlaybookRunViewSet(TenantAwareModelViewSet):
    serializer_class = PlaybookRunSerializer
    permission_classes = [
        TenantPermission,
        RoleBasedPermission([Permission.VIEW_PLAYBOOKS], require_all=False),
    ]
    queryset = PlaybookRun.objects.select_related('tenant', 'playbook', 'triggered_by').all()
    
    @action(detail=False, methods=['get'])
    def executions(self, request):
        runs = self.get_queryset()
        serializer = self.get_serializer(runs, many=True)
        return success_response(data=serializer.data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        run = self.get_object()
        if run.status in ['pending', 'running']:
            run.status = 'cancelled'
            run.completed_at = timezone.now()
            run.save()
            return success_response(message='Run cancelled')
        return error_response('Cannot cancel this run', 'INVALID_STATE', status.HTTP_400_BAD_REQUEST)


class SecurityAgentViewSet(TenantAwareModelViewSet):
    serializer_class = SecurityAgentSerializer
    permission_classes = [
        TenantPermission,
        RoleBasedPermission([Permission.VIEW_PLAYBOOKS, Permission.MANAGE_PLAYBOOKS], require_all=False),
    ]
    queryset = SecurityAgent.objects.select_related('tenant', 'created_by').prefetch_related('assigned_playbooks').all()
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        agent = self.get_object()
        agent.status = 'active'
        agent.last_heartbeat = timezone.now()
        agent.save()
        return success_response(message='Agent started')
    
    @action(detail=True, methods=['post'])
    def stop(self, request, pk=None):
        agent = self.get_object()
        agent.status = 'inactive'
        agent.save()
        return success_response(message='Agent stopped')
    
    @action(detail=True, methods=['post'])
    def heartbeat(self, request, pk=None):
        agent = self.get_object()
        agent.last_heartbeat = timezone.now()
        if agent.status == 'error':
            agent.status = 'active'
        agent.save()
        return success_response(message='Heartbeat updated')


class WebhookViewSet(TenantAwareModelViewSet):
    serializer_class = WebhookSerializer
    permission_classes = [
        TenantPermission,
        RoleBasedPermission([Permission.MANAGE_INTEGRATIONS], require_all=False),
    ]
    queryset = Webhook.objects.select_related('tenant').all()
    
    @action(detail=True, methods=['post'])
    def test(self, request, pk=None):
        webhook = self.get_object()
        return success_response(data={'message': 'Webhook test endpoint', 'url': webhook.url})
