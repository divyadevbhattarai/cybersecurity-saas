#!/bin/bash

echo "Starting Cybersecurity SaaS Platform..."

# Start backend server
echo "Starting backend server..."
cd cybersecurity_backend
python manage.py runserver 0.0.0.0:8000 &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend server
echo "Starting frontend server..."
cd ../cybersecurity-saas-frontend
npm start &

echo "Development servers started!"
echo "  Backend: http://localhost:8000"
echo "  Frontend: http://localhost:3000"
echo ""
echo "To stop servers, run: kill $BACKEND_PID"
