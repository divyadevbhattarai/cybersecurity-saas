from django.urls import re_path
from ml_model.consumers import AnomalyConsumer

websocket_urlpatterns = [
    re_path(r'ws/anomaly_alerts/$', AnomalyConsumer.as_asgi()),
]
