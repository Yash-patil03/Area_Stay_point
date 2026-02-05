# Quick Setup Guide

## Network Error Fix Applied:
- Changed API URL from HTTPS port 7000 to HTTP port 5000
- Updated CORS configuration
- Fixed launch settings

## To Start the Application:

### Option 1: Use Batch File
1. Double-click `start-both.bat`
2. Wait for both servers to start

### Option 2: Manual Start
1. **Backend**: 
   ```
   cd PGFinder2
   dotnet run --launch-profile http
   ```
   Should show: "Now listening on: http://localhost:5000"

2. **Frontend**:
   ```
   cd pgfinder-frontend  
   npm start
   ```
   Should open: http://localhost:3000

## Test Connection:
- Go to: http://localhost:3000/test
- Click "Test Connection" - should show "API is working!"

## New Features Added:
1. **PG Details Page**: Click "View Details" to see complete PG information
2. **Book Now**: Direct booking from PG list or details page
3. **Better Error Handling**: Clear network error messages

## Pre-seeded Test Accounts:
- **Admin**: admin@pgfinder.com / Admin@123
- **Owner**: owner@pgfinder.com / Owner@123

## URLs:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Test: http://localhost:3000/test
- Swagger: http://localhost:5000/swagger