# Cybersecurity SaaS Frontend

## Project Overview
This is the frontend component of the **Cybersecurity SaaS Platform**, built with React. It provides a user-friendly interface for monitoring cloud security, viewing anomaly detection results, and managing security audits.

## Table of Contents
- [Quick Start](#quick-start)
- [WebSocket Integration](#websocket-integration)
- [Backend Connection](#backend-connection)
- [Environment Setup](#environment-setup)
- [Features](#features)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Testing & Building](#testing--building)

## Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/divyadevbhattarai/cybersecurity-saas-monorepo.git
   cd cybersecurity-saas-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_BACKEND_URL=http://localhost:8000
   REACT_APP_WS_URL=ws://localhost:8000
   ```

4. **Start development server**:
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## WebSocket Integration

The frontend establishes a WebSocket connection for real-time threat alerts and updates:

```javascript
// Example WebSocket connection
const socket = new WebSocket('ws://localhost:8000/ws/alerts/');

socket.onopen = function(event) {
    console.log('WebSocket connected');
};

socket.onmessage = function(event) {
    const alert = JSON.parse(event.data);
    console.log('Anomaly Alert:', alert);
    // Update UI with alert
};

socket.onerror = function(error) {
    console.error('WebSocket error:', error);
};
```

## Backend Connection

The frontend communicates with the backend API using the Fetch API:

```javascript
// Example API call
const fetchAudits = async () => {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cloud-audits/audit/`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data;
};
```

## Environment Setup

### Required Environment Variables
- `REACT_APP_BACKEND_URL`: Backend API URL (e.g., `http://localhost:8000`)
- `REACT_APP_WS_URL`: WebSocket server URL (e.g., `ws://localhost:8000`)

### Optional Environment Variables
- `REACT_APP_LOG_LEVEL`: Logging level (default: `info`)
- `REACT_APP_API_TIMEOUT`: API request timeout in milliseconds (default: `30000`)

## Features

### 1. Real-Time Alerts
- Receive instant notifications for detected anomalies
- WebSocket-based live updates
- Alert history and management

### 2. Security Audit Dashboard
- View results of cloud security audits
- Monitor S3, IAM, KMS, and CloudTrail status
- Track compliance metrics

### 3. Anomaly Detection Interface
- View detected unusual login patterns
- Track geolocation and IP address anomalies
- Historical anomaly data with filtering

### 4. User Management
- User authentication and profile management
- Role-based access control
- Secure token-based session management

## Project Structure

```
src/
├── components/       # Reusable React components
├── pages/           # Page components
├── services/        # API and WebSocket services
├── hooks/           # Custom React hooks
├── context/         # React Context for state management
├── utils/           # Utility functions
└── App.js           # Main App component
```

## Available Scripts

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder. The build is minified and optimized for best performance.

### `npm run eject`
**Note: this is a one-way operation.**

## Testing & Building

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

### Performance Optimization
- Code splitting is automatically handled by Create React App
- Use React.lazy() for route-based code splitting
- Memoize expensive components with React.memo()

## Documentation Links
- [Backend Documentation](../README.md)
- [API Documentation](../API_DOCUMENTATION.md)
- [Architecture Guide](../ARCHITECTURE.md)
- [Contributing Guidelines](../CONTRIBUTING.md)

## License
This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.