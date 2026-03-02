from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/v1/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/v1/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path('api/v1/users/', include('users.urls')),
    path('api/v1/breaches/', include('breaches.urls')),
    path('api/v1/cloud-audits/', include('cloud_audits.urls')),
    path('api/v1/ml/', include('ml_model.urls')),
    path('api/v1/ztna/', include('ztna.urls')),
    path('api/v1/soar/', include('soar.urls')),
    path('api/v1/sbom/', include('sbom.urls')),
    path('api/v1/rasp/', include('rasp.urls')),
    path('api/v1/deception/', include('deceptive_security.urls')),
    path('api/v1/audit-trail/', include('audit_trail.urls')),
    path('api/v1/quantum-crypto/', include('quantum_crypto.urls')),
    path('api/v1/confidential-computing/', include('confidential_computing.urls')),
    path('api/v1/privacy-ml/', include('privacy_ml.urls')),
]
