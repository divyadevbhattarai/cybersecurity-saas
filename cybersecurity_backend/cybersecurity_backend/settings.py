import os
from pathlib import Path
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent

from dotenv import load_dotenv

load_dotenv(BASE_DIR / '.env')


SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')

DEBUG = os.getenv('DEBUG', 'False').lower() in ('true', '1', 'yes')

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'corsheaders',
    'channels',
    'drf_spectacular',

    'security',
    'users',
    'breaches',
    'cloud_audits',
    'ml_model',
    'ztna',
    'soar',
    'sbom',
    'rasp',
    'deceptive_security',
    'audit_trail',
    'quantum_crypto',
    'confidential_computing',
    'privacy_ml',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'security.middleware.ContentSecurityPolicyMiddleware',
    'security.middleware.TenantMiddleware',
    'security.middleware.TenantRateThrottleMiddleware',
    'security.middleware.SQLInjectionProtectionMiddleware',
    'security.middleware.CommandInjectionProtectionMiddleware',
    'security.middleware.ClickjackingProtectionMiddleware',
    'security.middleware.HSTSMiddleware',
]

ROOT_URLCONF = 'cybersecurity_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'cybersecurity_backend.wsgi.application'
ASGI_APPLICATION = 'cybersecurity_backend.asgi.application'


# Database
# https://docs.djangoproject.com/en/6.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': os.getenv('DB_ENGINE', 'django.db.backends.sqlite3'),
        'NAME': os.getenv('DB_NAME', BASE_DIR / 'db.sqlite3'),
        'USER': os.getenv('DB_USER', ''),
        'PASSWORD': os.getenv('DB_PASSWORD', ''),
        'HOST': os.getenv('DB_HOST', ''),
        'PORT': os.getenv('DB_PORT', ''),
    }
}


# Password validation
# https://docs.djangoproject.com/en/6.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
    {
        'NAME': 'security.validators.StrongPasswordValidator',
        'OPTIONS': {
            'min_length': 12,
            'require_uppercase': True,
            'require_lowercase': True,
            'require_digit': True,
            'require_special': True,
        }
    },
]


# Internationalization
# https://docs.djangoproject.com/en/6.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Custom User Model
AUTH_USER_MODEL = 'users.User'

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/6.0/howto/static-files/

STATIC_URL = 'static/'

# CORS settings - strict security
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:3000').split(',')
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    'x-tenant-id',
]
CORS_ALLOW_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
CORS_PREFLIGHT_MAX_AGE = 3600
CORS_EXPOSE_HEADERS = ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset']

# Disallow localhost in production
if not DEBUG:
    CORS_ALLOWED_ORIGINS = [origin for origin in CORS_ALLOWED_ORIGINS if 'localhost' not in origin]

# REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'security.cookie_auth.CookieJWTAuthentication',
        'security.advanced_auth.APIKeyAuthentication',
        'security.advanced_auth.SignedRequestAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'EXCEPTION_HANDLER': 'security.exceptions.custom_exception_handler',
}

# JWT Settings - Enhanced Security with httpOnly Cookies
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_OBTAIN_SERIALIZER': 'users.serializers.TokenObtainPairSerializer',
    'TOKEN_REFRESH_SERIALIZER': 'users.serializers.TokenRefreshSerializer',
    # Cookie settings - httpOnly for security
    'ACCESS_TOKEN_NAME': 'access_token',
    'REFRESH_TOKEN_NAME': 'refresh_token',
    'ACCESS_COOKIE': 'access_token',
    'REFRESH_COOKIE': 'refresh_token',
    'ACCESS_COOKIE_HTTPONLY': True,
    'REFRESH_COOKIE_HTTPONLY': True,
    'ACCESS_COOKIE_SECURE': not DEBUG,
    'REFRESH_COOKIE_SECURE': not DEBUG,
    'ACCESS_COOKIE_SAMESITE': 'Lax',
    'REFRESH_COOKIE_SAMESITE': 'Lax',
    'ACCESS_COOKIE_PATH': '/',
    'REFRESH_COOKIE_PATH': '/',
    'AUTH_COOKIE_DOMAIN': None,
    'TOKEN_OBTAIN_SERIALIZER': 'users.serializers.TokenObtainPairSerializer',
    'TOKEN_REFRESH_SERIALIZER': 'users.serializers.TokenRefreshSerializer',
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# CSRF Settings
CSRF_COOKIE_NAME = 'csrftoken'
CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SAMESITE = 'Lax'
CSRF_USE_SESSIONS = True

# API Key Configuration
API_KEY_RATE_LIMIT = 1000  # requests per hour
API_KEY_SIGNATURE_EXPIRY = 300  # 5 minutes

# Django Channels Configuration
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': os.getenv('CHANNEL_LAYER_BACKEND', 'channels.layers.InMemoryChannelLayer'),
        'CONFIG': {
            'hosts': [os.getenv('REDIS_URL', 'redis://localhost:6379/0')] if os.getenv('CHANNEL_LAYER_BACKEND') == 'channels_redis.core.RedisChannelLayer' else [],
        }
    }
}

# Rate Limiting Settings - Stricter for security
REST_FRAMEWORK['DEFAULT_THROTTLE_CLASSES'] = [
    'rest_framework.throttling.AnonRateThrottle',
    'rest_framework.throttling.UserRateThrottle',
]
REST_FRAMEWORK['DEFAULT_THROTTLE_RATES'] = {
    'anon': '60/minute',
    'user': '300/minute',
    'login': '5/minute',
    'password_reset': '3/minute',
    'register': '3/minute',
}

# Drf Spectacular Settings
SPECTACULAR_SETTINGS = {
    'TITLE': 'Cybersecurity SaaS API v1',
    'DESCRIPTION': '''Enterprise Cybersecurity SaaS Platform API v1

## Authentication

This API supports multiple authentication methods:

### JWT Authentication
- Obtain tokens via `/api/v1/users/login/`
- Use `Authorization: Bearer <access_token>` header

### API Key Authentication
- Create API keys from the dashboard
- Use `X-Api-Key: <prefix> <key>` header

### Signed Request Authentication
- For server-to-server communication
- Headers required:
  - `X-Api-Key-Id`: Your API key ID
  - `X-Request-Timestamp`: Unix timestamp
  - `X-Request-Signature`: HMAC-SHA256 signature
''',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'COMPONENT_SPLIT_REQUEST': True,
    'TAGS': [
        {'name': 'Users', 'description': 'User authentication and management'},
        {'name': 'Breaches', 'description': 'Breach detection and monitoring'},
        {'name': 'Cloud Audits', 'description': 'Cloud infrastructure security audits'},
        {'name': 'SOAR', 'description': 'Security Orchestration, Automation and Response'},
        {'name': 'ZTNA', 'description': 'Zero Trust Network Access'},
    ],
    'APPEND_COMPONENTS': {
        'securitySchemes': {
            'Bearer': {
                'type': 'http',
                'scheme': 'bearer',
                'description': 'JWT access token from /api/v1/users/login/',
            },
            'ApiKey': {
                'type': 'apiKey',
                'in': 'header',
                'name': 'X-Api-Key',
                'description': 'API Key in format: "prefix key" (e.g., "sk_testk abc123...")',
            },
            'SignedRequest': {
                'type': 'apiKey',
                'in': 'header',
                'name': 'X-Request-Signature',
                'description': 'HMAC-SHA256 signed request for server-to-server',
            },
        },
    },
}

# CSRF Settings
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SECURE = not DEBUG
CSRF_USE_SESSIONS = True
CSRF_HEADER_NAME = 'HTTP_X_CSRFTOKEN'

# Session Settings
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SECURE = not DEBUG
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_EXPIRE_AT_BROWSER_CLOSE = True
SESSION_COOKIE_AGE = 3600  # 1 hour

# SSL/TLS Settings
SECURE_SSL_REDIRECT = not DEBUG
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_HSTS_SECONDS = 31536000 if not DEBUG else 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = not DEBUG
SECURE_HSTS_PRELOAD = not DEBUG

# Additional Security Headers
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'

# Content Security Policy
CSP_DEFAULT_SRC = ("'self'",)
CSP_SCRIPT_SRC = ("'self'", "'unsafe-inline'")
CSP_STYLE_SRC = ("'self'", "'unsafe-inline'")
CSP_IMG_SRC = ("'self'", 'data:', 'https:')
CSP_CONNECT_SRC = ("'self'",)
CSP_FONT_SRC = ("'self'",)
CSP_OBJECT_SRC = ("'none'",)
CSP_BASE_URI = ("'self'",)
CSP_FRAME_ANCESTORS = ("'none'",)

# File Upload Security
FILE_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB
FILE_UPLOAD_PERMISSIONS = 0o644

# Email Settings
EMAIL_BACKEND = os.getenv('EMAIL_BACKEND', 'django.core.mail.backends.console.EmailBackend')
EMAIL_HOST = os.getenv('EMAIL_HOST', 'localhost')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', 587))
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True').lower() == 'true'
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'noreply@cybershield.com')

# Frontend URL for email links
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')

# Data Encryption Settings
DATA_ENCRYPTION_KEY = os.getenv('DATA_ENCRYPTION_KEY')
if not DATA_ENCRYPTION_KEY:
    raise ValueError("DATA_ENCRYPTION_KEY environment variable is required")

# API Request Signing Key (for replay attack prevention)
API_SIGNING_KEY = os.getenv('API_SIGNING_KEY', os.getenv('DJANGO_SECRET_KEY', ''))
if not API_SIGNING_KEY:
    import secrets
    API_SIGNING_KEY = secrets.token_hex(32)

# JWT Settings - Improved Security
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_CLAIM_CLASSES': {
        'access': 'rest_framework_simplejwt.tokens.AccessToken',
    },
    'JTI_CLAIM': 'jti',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}

# Security Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'security': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.security': {
            'handlers': ['console'],
            'level': 'WARNING',
            'propagate': False,
        },
    },
}

# Cache configuration for rate limiting
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}
