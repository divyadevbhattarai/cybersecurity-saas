#!/bin/bash

echo "Cleaning up Cybersecurity SaaS Platform..."

# Remove Python cache
echo "Removing Python cache..."
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null
find . -type f -name "*.pyc" -delete 2>/dev/null
find . -type f -name "*.pyo" -delete 2>/dev/null

# Remove Node modules
echo "Removing Node modules..."
rm -rf cybersecurity-saas-frontend/node_modules

# Remove build artifacts
echo "Removing build artifacts..."
rm -rf cybersecurity-saas-frontend/build
rm -rf cybersecurity_backend/staticfiles
rm -rf cybersecurity_backend/media

# Remove database
echo "Removing database..."
rm -f cybersecurity_backend/db.sqlite3

# Remove migrations (except __init__.py)
echo "Resetting migrations..."
find cybersecurity_backend -name "migrations" -type d -exec rm -rf {} + 2>/dev/null

echo "Cleanup complete!"
echo ""
echo "To rebuild, run: ./scripts/build.sh"
