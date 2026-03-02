# System Architecture Documentation

## Overview

This document outlines the comprehensive system architecture for our cybersecurity SaaS platform. The architecture is designed to be scalable, secure, and efficient in processing and analyzing security threats.

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CYBERSECURITY SAAS PLATFORM                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      FRONTEND (React)                                │   │
│  │  Dashboard | ZTNA | SOAR | RASP | Breaches | ML | SBOM | Privacy    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│                                     ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    DJANGO REST API (API v1)                          │   │
│  │  JWT Authentication | Swagger UI | Rate Limiting                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│                                     ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      12 DJANGO APPS                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│                                     ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      POSTGRESQL DATABASE                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Component Relationships

### Frontend Layer
- **React 18** with Redux for state management
- **React Router** for navigation
- **Axios** for HTTP requests to backend API
- 12 pages: Dashboard, ZTNA, SOAR, RASP, Breaches, SBOM, Cloud Audits, Quantum Crypto, Deceptive Security, Confidential Computing, Privacy ML, Audit Trail

### API Layer
- **Django REST Framework** for REST API
- **drf-spectacular** for OpenAPI/Swagger documentation
- **JWT** for authentication (djangorestframework-simplejwt)
- Versioned endpoints: `/api/v1/`

### Backend Applications (12 Apps)

| App | Purpose | Key Models |
|-----|---------|------------|
| `users` | User authentication | User |
| `breaches` | Data breach monitoring | Breach |
| `ztna` | Zero-trust network access | BiometricProfile, ZTNAProfile, Web3Identity, AccessRequest |
| `ml_model` | Anomaly detection | AnomalyDetectionResult |
| `soar` | Security orchestration | Playbook, Agent, Execution |
| `cloud_audits` | AWS compliance | CloudAuditResult |
| `sbom` | Software Bill of Materials | SBOMComponent |
| `rasp` | Runtime protection | AttackEvent |
| `deceptive_security` | Honeypots & canaries | Honeypot, CanaryToken |
| `quantum_crypto` | Key management | CryptoKey, Algorithm |
| `confidential_computing` | Enclave management | Enclave |
| `privacy_ml` | Federated learning | Participant, PrivacyModel |
| `audit_trail` | Audit logging | AuditLog |

## Data Flow

1. **User Interaction**: Users interact with the React frontend
2. **Authentication**: User authenticates via JWT tokens
3. **API Request**: Frontend sends requests to Django REST API
4. **Validation**: Request is validated and authenticated
5. **Processing**: Views process the request, interact with database
6. **Response**: JSON response sent back to frontend
7. **Display**: Frontend updates UI with response data

## Security Architecture

### Authentication
- JWT (JSON Web Tokens) for API authentication
- Access token: 15 minutes expiry
- Refresh token: 7 days expiry

### Authorization
- Django's permission system
- IsAuthenticated permission class on all views

### Data Protection
- Password hashing with Argon2
- HTTPS in production
- Environment variables for secrets

## API Gateway

The Django application serves as the API gateway:
- Routes requests to appropriate views
- Implements authentication
- Rate limiting (100 requests/hour)
- CORS headers for frontend access
- API versioning

## Database Schema

### Core Tables
- **users_user**: id, username, email, password, created_at
- **breaches_breach**: id, title, description, severity, status, created_at
- **ztna_biometricprofile**: id, user, biometric_data, created_at
- **ztna_accessrequest**: id, user, resource, status, created_at
- **ml_model_anomalydetectionresult**: id, timestamp, anomaly_type, score
- **soar_playbook**: id, name, description, status, created_at
- **cloud_audits_cloudauditresult**: id, audit_type, resource_name, status
- **sbom_sbomcomponent**: id, name, version, vulnerability_count
- **rasp_attackevent**: id, timestamp, attack_type, severity
- **deceptive_security_honeypot**: id, name, type, status
- **quantum_crypto_cryptokey**: id, algorithm, key_value, created_at
- **confidential_computing_enclave**: id, name, status, created_at
- **privacy_ml_participant**: id, name, organization, status
- **audit_trail_auditlog**: id, user, action, resource, timestamp

## Scalability Considerations

### Horizontal Scaling
- Django application is stateless
- Can run multiple instances behind load balancer
- PostgreSQL for shared data store

### Caching
- Redis can be integrated for caching
- View-level caching for frequently accessed data

### Performance
- Database indexing on key fields
- Pagination on list views
- Efficient Django ORM queries

## Environment Configuration

### Development
- SQLite or PostgreSQL local database
- No AWS credentials required (demo mode for cloud audits)
- Debug mode enabled

### Production
- PostgreSQL database
- AWS credentials for cloud audit features
- Debug mode disabled
- HTTPS enabled
- Gunicorn or uWSGI for WSGI

## External Integrations

### AWS (Optional)
- Cloud Audit: S3, IAM, KMS, CloudTrail
- Works without credentials (returns demo data)

### Swagger/OpenAPI
- Auto-generated from code
- Available at `/api/v1/docs/`
- ReDoc at `/api/v1/redoc/`

---

This architecture provides a robust framework for developing a secure and efficient cybersecurity SaaS platform. Last updated: March 2026
