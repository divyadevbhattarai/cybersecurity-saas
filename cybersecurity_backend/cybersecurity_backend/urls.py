from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/breaches/', include('breaches.urls')),
    path('api/cloud-audits/', include('cloud_audits.urls')),
    path('api/ml-model/', include('ml_model.urls')),
]
