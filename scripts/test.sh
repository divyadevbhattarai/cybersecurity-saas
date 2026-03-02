#!/bin/bash

echo "Running tests for Cybersecurity SaaS Platform..."

# Run Django tests
echo "Running Django backend tests..."
cd cybersecurity_backend
python manage.py test --verbosity=2

# Run React tests (if any)
echo "Running frontend tests..."
cd ../cybersecurity-saas-frontend
if [ -f "package.json" ] && grep -q '"test"' package.json; then
    npm test -- --coverage
else
    echo "No frontend tests configured"
fi

echo "Tests complete!"
