# API Documentation for Cybersecurity SaaS Platform

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
4. [Request/Response Examples](#requestresponse-examples)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Interactive Documentation](#interactive-documentation)

## Overview

The Cybersecurity SaaS platform provides a RESTful API with versioned endpoints under `/api/v1/`. The API supports full CRUD operations on all resources and uses JWT for authentication.

**Base URL**: `http://localhost:8000/api/v1/`

## Authentication

### JWT Authentication
All protected endpoints require JWT authentication. Include the access token in the Authorization header:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Obtaining Tokens

**Register**: `POST /api/v1/users/register/`
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Login**: `POST /api/v1/users/login/`
```json
{
  "username": "newuser",
  "password": "securepassword123"
}
```

**Response**:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "newuser",
    "email": "user@example.com"
  }
}
```

**Refresh Token**: `POST /api/v1/users/token/refresh/`
```json
{
  "refresh": "YOUR_REFRESH_TOKEN"
}
```

## API Endpoints

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/register/` | User registration |
| POST | `/users/login/` | User login |
| POST | `/users/logout/` | User logout |
| GET | `/users/me/` | Get current user |
| PUT/PATCH | `/users/me/` | Update current user |
| POST | `/users/password-reset/` | Request password reset |
| POST | `/users/password-reset/confirm/` | Confirm password reset with token |
| POST | `/users/set-password/` | Set password (authenticated) |

### Breaches
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/breaches/` | List all breaches |
| POST | `/breaches/` | Create a breach |
| GET | `/breaches/{id}/` | Get breach detail |
| PUT/PATCH | `/breaches/{id}/` | Update breach |
| DELETE | `/breaches/{id}/` | Delete breach |

### ZTNA (Zero Trust Network Access)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/ztna/profiles/` | List access profiles |
| POST | `/ztna/profiles/` | Create access profile |
| GET | `/ztna/biometrics/` | List biometric profiles |
| POST | `/ztna/biometrics/` | Create biometric profile |
| GET | `/ztna/access-requests/` | List access requests |
| POST | `/ztna/access-requests/` | Create access request |
| GET | `/ztna/web3-identity/` | List Web3 identities |
| POST | `/ztna/web3-identity/` | Create Web3 identity |

### ML Model
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/ml/anomalies/` | List anomaly detections |
| POST | `/ml/anomalies/` | Create anomaly detection |
| GET | `/ml/threats/detect/` | Run threat detection |

### SOAR (Security Orchestration)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/soar/playbooks/` | List playbooks |
| POST | `/soar/playbooks/` | Create playbook |
| GET | `/soar/agents/` | List security agents |
| POST | `/soar/agents/` | Create security agent |
| GET | `/soar/runs/executions/` | List executions |
| POST | `/soar/runs/executions/` | Run playbook |

### Cloud Audits
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cloud-audits/` | List audit results |
| POST | `/cloud-audits/` | Create audit result |
| POST | `/cloud-audits/run/` | Run cloud audit |

**Note**: Cloud audits can work with or without AWS credentials. Without credentials, demo data is returned.

### SBOM (Software Bill of Materials)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/sbom/` | List SBOM entries |
| POST | `/sbom/` | Create SBOM entry |
| GET | `/sbom/{id}/` | Get SBOM detail |
| PUT/PATCH | `/sbom/{id}/` | Update SBOM |
| DELETE | `/sbom/{id}/` | Delete SBOM |

### RASP (Runtime Application Self-Protection)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/rasp/events/attacks/` | List attack events |
| POST | `/rasp/events/attacks/` | Create attack event |
| GET | `/rasp/events/stats/` | Get RASP statistics |

### Deceptive Security
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/deception/honeypots/` | List honeypots |
| POST | `/deception/honeypots/` | Create honeypot |
| GET | `/deception/canaries/` | List canary tokens |
| POST | `/deception/canaries/` | Create canary token |

### Quantum Cryptography
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/quantum-crypto/keys/` | List cryptographic keys |
| POST | `/quantum-crypto/keys/` | Create key |
| GET | `/quantum-crypto/algorithms/` | List algorithms |
| POST | `/quantum-crypto/algorithms/` | Create algorithm |
| GET | `/quantum-crypto/rotation-history/` | List rotation history |

### Confidential Computing
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/confidential-computing/enclaves/` | List enclaves |
| POST | `/confidential-computing/enclaves/` | Create enclave |

### Audit Trail
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/audit-trail/` | List audit logs |
| POST | `/audit-trail/` | Create audit log |

### Privacy ML
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/privacy-ml/participants/` | List participants |
| POST | `/privacy-ml/participants/` | Create participant |
| GET | `/privacy-ml/models/` | List models |
| POST | `/privacy-ml/models/` | Create model |

## Request/Response Examples

### User Login
**Request**:
```json
POST /api/v1/users/login/
{
  "username": "admin",
  "password": "admin123"
}
```

**Response**:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com"
  }
}
```

### Create Breach
**Request**:
```json
POST /api/v1/breaches/
{
  "title": "Data Breach Example",
  "description": "Unauthorized access to customer data",
  "severity": "HIGH",
  "status": "open",
  "affected_systems": ["web-server-1", "db-server-2"]
}
```

**Response**:
```json
{
  "id": 1,
  "title": "Data Breach Example",
  "description": "Unauthorized access to customer data",
  "severity": "HIGH",
  "status": "open",
  "affected_systems": ["web-server-1", "db-server-2"],
  "created_at": "2026-03-01T10:00:00Z",
  "updated_at": "2026-03-01T10:00:00Z"
}
```

### Threat Detection
**Request**:
```json
GET /api/v1/ml/threats/detect/
```

**Response**:
```json
{
  "anomalies": [
    {
      "user_id": 1,
      "failed_login_attempts": 5,
      "risk_score": 0.85,
      "anomaly_type": "unusual_login_time"
    }
  ]
}
```

## Error Handling

All error responses follow a consistent format:

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE"
}
```

Common HTTP Status Codes:
- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Invalid or missing authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

## Rate Limiting

The API is rate-limited to 100 requests per hour per user. Exceeding this limit will result in a **429 Too Many Requests** status code.

## Interactive Documentation

Interactive API documentation is available:

- **Swagger UI**: http://localhost:8000/api/v1/docs/
- **ReDoc**: http://localhost:8000/api/v1/redoc/
- **OpenAPI Schema**: http://localhost:8000/api/v1/schema/

---

This documentation was last updated: March 2026
