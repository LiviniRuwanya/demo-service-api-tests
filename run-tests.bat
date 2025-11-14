@echo off
REM API Test Suite Runner Script for Windows
REM This script runs Newman tests with proper error handling and reporting

echo 🚀 Starting API Test Suite...
echo.

REM Check if Newman is installed
where newman >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Newman is not installed. Installing dependencies...
    call npm install
)

REM Set default base URL if not provided
if "%BASE_URL%"=="" set BASE_URL=https://jsonplaceholder.typicode.com

echo 📍 Using base URL: %BASE_URL%
echo.

REM Run tests
echo 🧪 Running API tests...
call newman run postman-collection.json -e postman-environment.json --env-var "base_url=%BASE_URL%" --reporters cli,json,html --reporter-json-export newman-report.json --reporter-html-export newman-report.html --bail

REM Check exit code
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ All tests passed!
    echo 📊 View detailed report: newman-report.html
    exit /b 0
) else (
    echo.
    echo ❌ Some tests failed. Check newman-report.html for details.
    exit /b 1
)

