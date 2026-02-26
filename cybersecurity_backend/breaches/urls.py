from django.urls import path
from .views import BreachListView, BreachDetailView

urlpatterns = [
    path('', BreachListView.as_view(), name='breach-list'),
    path('<int:pk>/', BreachDetailView.as_view(), name='breach-detail'),
]
