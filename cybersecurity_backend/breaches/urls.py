from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BreachViewSet

router = DefaultRouter()
router.register('', BreachViewSet, basename='breach')

urlpatterns = [
    path('', include(router.urls)),
]
