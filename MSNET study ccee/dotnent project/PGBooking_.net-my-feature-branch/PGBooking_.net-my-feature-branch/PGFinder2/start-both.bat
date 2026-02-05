@echo off
echo Starting PG Finder Application...
echo.

echo Starting .NET Backend API on HTTP port 5000...
cd "PGFinder2"
start "Backend API" cmd /k "dotnet run --launch-profile http"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting React Frontend...
cd "..\pgfinder-frontend"
start "Frontend React" cmd /k "npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo API Test: http://localhost:3000/test
echo.
echo Press any key to exit...
pause > nul