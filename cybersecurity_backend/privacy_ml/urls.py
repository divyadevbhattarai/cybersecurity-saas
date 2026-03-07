from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from .views import FederatedModelViewSet, TrainingJobViewSet

router = DefaultRouter()
router.register(r'models', FederatedModelViewSet, basename='federated-models')
router.register(r'training-jobs', TrainingJobViewSet, basename='training-jobs')

urlpatterns = [
    path('', include(router.urls)),
    re_path(r'^participants/$', FederatedModelViewSet.as_view({'get': 'participants'}), name='participants-alias'),
]
