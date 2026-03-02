#!/bin/bash

echo "Deploying Cybersecurity SaaS Platform..."

# Run migrations
echo "Running migrations..."
cd cybersecurity_backend
python manage.py migrate
python manage.py collectstatic --noinput
cd ..

# Start backend server
echo "Starting backend server..."
cd cybersecurity_backend
python manage.py runserver 0.0.0.0:8000 &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend server
echo "Starting frontend server..."
cd cybersecurity-saas-frontend
npm start &
FRONTEND_PID=$!

echo "Deployment complete!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Access the application at:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:8000/api"

# Keep script running
wait
