# Deployment Guide

## Quick Start (Development)

### Backend

```bash
cd cybersecurity_backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The API will be available at:
- http://localhost:8000
- Swagger UI: http://localhost:8000/api/v1/docs/
- ReDoc: http://localhost:8000/api/v1/redoc/

### Frontend

```bash
cd cybersecurity-saas-frontend
npm install
npm start
```

The frontend will be available at http://localhost:3000

---

## Production Deployment

### 1. Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- Nginx
- (Optional) AWS credentials for cloud audit features

### 2. Backend Configuration

Create production settings:

```python
# cybersecurity_backend/cybersecurity_backend/settings.py
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'cybersec_db',
        'USER': 'db_user',
        'PASSWORD': 'secure_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### 3. Environment Variables

```bash
# Required
DATABASE_URL=postgresql://user:password@localhost:5432/cybersec_db
SECRET_KEY=your-production-secret-key

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Optional: AWS for cloud audits
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1

# Security
ALLOWED_HOSTS=yourdomain.com
CSRF_TRUSTED_ORIGINS=https://yourdomain.com
```

### 4. Database Setup

```bash
python manage.py migrate
python manage.py collectstatic
python manage.py createsuperuser
```

### 5. WSGI Server

Install Gunicorn:
```bash
pip install gunicorn
```

Run with Gunicorn:
```bash
gunicorn cybersecurity_backend.wsgi:application --bind 0.0.0.0:8000 --workers 4
```

### 6. Frontend Build

```bash
cd cybersecurity-saas-frontend
npm run build
```

The build output will be in `build/` directory.

### 7. Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /path/to/cybersecurity-saas-frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Static files
    location /static/ {
        alias /path/to/staticfiles/;
    }
}
```

---

## Docker Deployment

### Dockerfile (Backend)

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py migrate
RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "cybersecurity_backend.wsgi:application", "--bind", "0.0.0.0:8000"]
```

### Dockerfile (Frontend)

```dockerfile
FROM node:18 as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: cybersec_db
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./cybersecurity_backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/cybersec_db
      - SECRET_KEY=dev-secret-key
    depends_on:
      - db

  frontend:
    build: ./cybersecurity-saas-frontend
    ports:
      - "3000:80"

volumes:
  postgres_data:
```

---

## Cloud Deployment Options

### AWS

1. **ECS/Fargate**: Deploy Docker containers
2. **Elastic Beanstalk**: Auto-scaling web app
3. **RDS**: Managed PostgreSQL
4. **S3**: Static frontend hosting
5. **CloudFront**: CDN for static assets

### Azure

1. **Azure Kubernetes Service (AKS)**: Container orchestration
2. **Azure App Service**: Web apps
3. **Azure Database**: PostgreSQL
4. **Azure Blob Storage**: Static files

### GCP

1. **Google Kubernetes Engine (GKE)**: Container orchestration
2. **App Engine**: Serverless deployment
3. **Cloud SQL**: Managed PostgreSQL
4. **Cloud Storage**: Static files

---

## Scaling

### Horizontal Scaling
- Django is stateless, run multiple instances
- Use load balancer (nginx, AWS ALB)
- PostgreSQL for shared state

### Vertical Scaling
- Increase workers/gunicorn instances
- Database indexing
- Redis for caching (optional)

---

## Monitoring

### Logging
- Python logging module configured
- Use ELK stack or cloud logging

### Health Checks
- `/admin/` Django admin
- `/api/v1/schema/` OpenAPI schema

### Metrics
- Prometheus/Grafana integration
- Custom metrics endpoint (optional)

---

## Security Checklist

- [ ] HTTPS enabled
- [ ] DEBUG=False in production
- [ ] Strong SECRET_KEY
- [ ] Database backed by PostgreSQL
- [ ] Regular security updates
- [ ] Environment variables for secrets
- [ ] CORS configured for frontend domain
- [ ] Rate limiting enabled

---

## Troubleshooting

### Common Issues

**ImportError**: Run `pip install -r requirements.txt`

**Database connection**: Check DATABASE_URL and PostgreSQL running

**Static files not loading**: Run `python manage.py collectstatic`

**AWS errors**: Cloud audits work without AWS credentials (demo mode)

---

This guide was last updated: March 2026
