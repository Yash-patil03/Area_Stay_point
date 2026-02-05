@echo off
echo Starting PG Finder Application...
echo.

echo Starting .NET Backend...
start "Backend" cmd /k "cd /d \"c:\Users\Ajit\Desktop\Cdac\.NET\PGFinder2 (2)\PGFinder2\PGFinder2\" && dotnet run"

echo Waiting for backend to start...
timeout /t 10 /nobreak > nul

echo Starting React Frontend...
start "Frontend" cmd /k "cd /d \"c:\Users\Ajit\Desktop\Cdac\.NET\PGFinder2 (2)\PGFinder2\pgfinder-frontend\" && npm start"

echo.
echo Both applications are starting...
echo Backend: https://localhost:7000
echo Frontend: http://localhost:3000
echo.
pause