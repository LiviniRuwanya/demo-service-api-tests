#!/bin/bash

# API Test Suite Runner Script
# This script runs Newman tests with proper error handling and reporting

set -e  # Exit on error

echo "🚀 Starting API Test Suite..."
echo ""

# Check if Newman is installed
if ! command -v newman &> /dev/null; then
    echo "❌ Newman is not installed. Installing dependencies..."
    npm install
fi

# Set default base URL if not provided
BASE_URL=${BASE_URL:-"https://jsonplaceholder.typicode.com"}

echo "📍 Using base URL: $BASE_URL"
echo ""

# Run tests
echo "🧪 Running API tests..."
newman run postman-collection.json \
    -e postman-environment.json \
    --env-var "base_url=$BASE_URL" \
    --reporters cli,json,html \
    --reporter-json-export newman-report.json \
    --reporter-html-export newman-report.html \
    --bail

# Check exit code
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ All tests passed!"
    echo "📊 View detailed report: newman-report.html"
    exit 0
else
    echo ""
    echo "❌ Some tests failed. Check newman-report.html for details."
    exit 1
fi

