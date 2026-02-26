# Cybersecurity SaaS Platform

This project provides a comprehensive **Cybersecurity SaaS** platform designed to monitor and protect your cloud infrastructure through **security audits**, **AI-driven anomaly detection**, and **real-time threat monitoring**. It supports integration with **AWS** and can be expanded to other cloud providers (Azure, GCP).

## **Features**

1. **Cloud Security Audits**:
   - S3 bucket audits for public access
   - IAM roles check for overly permissive permissions
   - KMS encryption check for sensitive data
   - CloudTrail log review to ensure logging is enabled

2. **AI-Driven Anomaly Detection**:
   - Detects unusual login patterns (e.g., abnormal failed login attempts)
   - Tracks geolocation and IP address for abnormal access patterns
   - Uses **Isolation Forest** for anomaly detection

3. **Real-Time Threat Monitoring**:
   - Integrates with **AWS CloudWatch** for log monitoring
   - **Django Channels** for pushing real-time alerts to the frontend
   - WebSocket connection to the frontend for real-time anomaly alerts

## **Technologies Used**

- **Django**: Backend framework for building APIs
- **Django Rest Framework (DRF)**: To build RESTful APIs
- **Boto3**: AWS SDK for Python to interact with AWS services
- **Isolation Forest**: Machine learning algorithm for anomaly detection
- **Django Channels**: To push real-time notifications to the frontend
- **Celery** (Optional): For background tasks (e.g., running audits periodically)

## **Installation**

1. **Clone the repository**:

    ```bash
    git clone https://github.com/your-repo/cybersecurity-saas.git
    cd cybersecurity-saas
    ```

2. **Create and activate a virtual environment**:

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. **Install the dependencies**:

    ```bash
    pip install -r requirements.txt
    ```

4. **Set up environment variables** (for AWS credentials and Django settings):
    - Create a `.env` file or set the following variables manually:

    ```bash
    AWS_ACCESS_KEY_ID=your_aws_access_key
    AWS_SECRET_ACCESS_KEY=your_aws_secret_key
    AWS_REGION=us-east-1  # Replace with your AWS region
    DJANGO_SECRET_KEY=your_django_secret_key
    ```

5. **Run migrations**:

    ```bash
    python manage.py migrate
    ```

6. **Start the server**:

    ```bash
    python manage.py runserver
    ```

    Now the app should be running at `http://localhost:8000/`.

## **API Endpoints**

### **Authentication**
- **POST** `/api/auth/register/` – Register a new user
- **POST** `/api/auth/login/` – Log in and get JWT token

### **Cloud Security Audits**
- **GET** `/api/cloud-audits/audit/` – Trigger cloud security audit (e.g., S3, IAM roles, KMS, CloudTrail)

### **AI-Driven Anomaly Detection**
- **GET** `/api/ml-model/threat-detection/` – Detect anomalies in user behavior (e.g., failed login attempts, IP, geolocation)

## **Frontend Integration**

The **frontend** is built with **React**. It communicates with the backend via **REST APIs** and **WebSocket** for real-time notifications.

### **WebSocket Integration**
- The frontend listens for real-time alerts for detected anomalies using WebSocket.

To connect the frontend to the backend, make sure the `baseURL` in the frontend code matches the backend URL (usually `http://localhost:8000` for local development).

## **Running Real-Time Monitoring**

- Real-time anomaly alerts are pushed to the frontend using **Django Channels**.
- Make sure you have a **Redis server** running locally if you're using **Django Channels** for WebSocket communication.

## **Testing**

To test the API endpoints:
1. Use **Postman** or **curl** to register a user and log in to get a JWT token.
2. Use the JWT token to authenticate requests to other endpoints.
3. Test cloud security audits by triggering them via the `/api/cloud-audits/audit/` endpoint.
4. Trigger anomaly detection via the `/api/ml-model/threat-detection/` endpoint.

## **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.