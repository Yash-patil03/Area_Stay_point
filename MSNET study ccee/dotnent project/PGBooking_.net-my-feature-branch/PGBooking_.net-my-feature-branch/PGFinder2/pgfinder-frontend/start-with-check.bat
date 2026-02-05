@echo off
echo Starting PG Finder Frontend...
echo.

echo Checking if backend is running...
curl -s http://localhost:7071/api/health >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Backend not running on http://localhost:7071
    curl -s https://localhost:7071/api/health >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ Backend not running on https://localhost:7071
        echo.
        echo Please start your .NET backend first:
        echo 1. Navigate to your backend project
        echo 2. Run: dotnet run
        echo 3. Wait for "Now listening on: https://localhost:7071"
        echo 4. Then run this script again
        echo.
        pause
        exit /b 1
    ) else (
        echo ✅ Backend running on https://localhost:7071
    )
) else (
    echo ✅ Backend running on http://localhost:7071
)

echo.
echo Starting React development server...
npm start