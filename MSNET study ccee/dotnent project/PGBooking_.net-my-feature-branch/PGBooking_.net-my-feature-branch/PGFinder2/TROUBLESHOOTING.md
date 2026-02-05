# PG Finder - Login/Signup Troubleshooting Guide

## Quick Start Steps

### 1. Start Both Servers
```bash
# Option 1: Use the batch file
double-click start-both.bat

# Option 2: Manual start
# Terminal 1 - Backend
cd PGFinder2
dotnet run

# Terminal 2 - Frontend  
cd pgfinder-frontend
npm start
```

### 2. Test API Connection
- Go to: http://localhost:3000/test
- Click "Test Connection" to verify backend is running
- Click "Test Login" to test with pre-seeded admin account

### 3. Pre-seeded Test Accounts
```
Admin Account:
Email: admin@pgfinder.com
Password: Admin@123

Owner Account:
Email: owner@pgfinder.com  
Password: Owner@123
```

## Common Issues & Solutions

### Issue 1: "Cannot connect to server"
**Symptoms:** Connection refused, ECONNREFUSED error
**Solutions:**
1. Ensure .NET backend is running on https://localhost:7000
2. Check if port 7000 is available
3. Try accessing https://localhost:7000/swagger directly
4. Check Windows Firewall settings

### Issue 2: SSL Certificate Errors
**Symptoms:** Certificate expired, SSL handshake failed
**Solutions:**
1. Accept the certificate in browser when prompted
2. Go to https://localhost:7000 and accept certificate
3. Try using HTTP instead of HTTPS (update API_URL in api.js)

### Issue 3: "Invalid credentials" on Login
**Symptoms:** Login fails with valid credentials
**Solutions:**
1. Use pre-seeded accounts first (admin@pgfinder.com / Admin@123)
2. Check database has been seeded properly
3. Verify password hashing is working
4. Check browser console for detailed errors

### Issue 4: Registration Fails
**Symptoms:** Registration form shows errors
**Solutions:**
1. Ensure all validations pass:
   - Email: valid format
   - Password: 8+ chars, uppercase, lowercase, number, special char
   - Phone: 10-digit Indian number (starts with 6-9)
   - Name: 2-50 characters, letters and spaces only
2. Check if email already exists
3. Verify backend Role table has "User" role

### Issue 5: CORS Errors
**Symptoms:** Blocked by CORS policy
**Solutions:**
1. Verify CORS is configured in Program.cs
2. Check frontend URL is http://localhost:3000
3. Restart backend after CORS changes

## Debugging Steps

### 1. Check Backend Status
```bash
# In PGFinder2 directory
dotnet run
# Should show: Now listening on: https://localhost:7000
```

### 2. Verify Database
```bash
# Check if database exists and has data
dotnet ef database update
# Should create PGFinderDB with seeded data
```

### 3. Test API Endpoints
- Swagger UI: https://localhost:7000/swagger
- Test endpoint: https://localhost:7000/api/auth/test
- Login endpoint: POST https://localhost:7000/api/auth/login

### 4. Check Browser Console
- Open Developer Tools (F12)
- Look for network errors, CORS issues, or JavaScript errors
- Check Network tab for failed requests

### 5. Verify Frontend Dependencies
```bash
# In pgfinder-frontend directory
npm install
npm start
# Should open http://localhost:3000
```

## File Locations

### Backend Files
- Controllers: `PGFinder2/Controllers/AuthController.cs`
- Configuration: `PGFinder2/Program.cs`
- Database: `PGFinder2/Data/AppDbContext.cs`
- Models: `PGFinder2/Models/`

### Frontend Files
- API Service: `pgfinder-frontend/src/services/api.js`
- Auth Components: `pgfinder-frontend/src/components/Auth/`
- Context: `pgfinder-frontend/src/context/AuthContext.js`

## Success Indicators

### Backend Running Successfully
- Console shows: "Now listening on: https://localhost:7000"
- Swagger UI accessible at https://localhost:7000/swagger
- Test endpoint returns: {"message": "API is working!", "timestamp": "..."}

### Frontend Running Successfully  
- Browser opens http://localhost:3000
- No console errors in browser
- API test page shows successful connection

### Authentication Working
- Login with admin@pgfinder.com / Admin@123 succeeds
- Registration creates new user and redirects to login
- JWT token stored in localStorage
- Protected routes accessible after login

## Contact & Support

If issues persist:
1. Check all file paths are correct
2. Ensure all dependencies are installed
3. Verify database connection string
4. Check Windows/antivirus isn't blocking ports
5. Try restarting both servers

## Quick Commands Reference

```bash
# Backend
cd PGFinder2
dotnet restore
dotnet ef database update
dotnet run

# Frontend
cd pgfinder-frontend
npm install
npm start

# Test URLs
Frontend: http://localhost:3000
Backend: https://localhost:7000
API Test: http://localhost:3000/test
Swagger: https://localhost:7000/swagger
```