from django.contrib import admin
from .models import FederatedModel, TrainingJob


@admin.register(FederatedModel)
class FederatedModelAdmin(admin.ModelAdmin):
    list_display = ['name', 'version', 'status', 'accuracy', 'participants', 'created_at']
    list_filter = ['status', 'version']
    search_fields = ['name']


@admin.register(TrainingJob)
class TrainingJobAdmin(admin.ModelAdmin):
    list_display = ['model', 'status', 'rounds', 'accuracy', 'started_at', 'completed_at']
    list_filter = ['status']
    search_fields = ['model__name']
