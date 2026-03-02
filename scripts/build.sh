#!/bin/bash

echo "Building Cybersecurity SaaS Platform..."

# Build backend
echo "Building backend..."
cd cybersecurity_backend
python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic --noinput
cd ..

# Build frontend
echo "Building frontend..."
cd cybersecurity-saas-frontend
npm run build
cd ..

echo "Build complete!"
