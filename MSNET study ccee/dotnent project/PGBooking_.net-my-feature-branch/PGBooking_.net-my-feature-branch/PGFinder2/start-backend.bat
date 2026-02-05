@echo off
echo Starting PG Finder Backend on HTTP port 5000...
cd "PGFinder2"
dotnet run --launch-profile http
pause