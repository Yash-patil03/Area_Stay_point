# Network Error Troubleshooting Guide

## Quick Fix Commands

### 1. Start with Backend Check
```bash
# Use the new startup script
npm run start:check
```

### 2. Safe Start (Bypass HTTPS issues)
```bash
npm run start:safe
```

### 3. Manual Backend Check
```bash
# Check if backend is running
curl http://localhost:7000/api/health
# OR
curl https://localhost:7000/api/health
```

## Common Issues & Solutions

### Issue 1: "Network Error" or "ECONNREFUSED"
**Cause**: Backend server is not running
**Solution**: 
1. Start your .NET backend first
2. Navigate to backend project: `cd ../backend`
3. Run: `dotnet run`
4. Wait for "Now listening on: https://localhost:7000"
5. Then start frontend

### Issue 2: HTTPS Certificate Errors
**Cause**: Self-signed certificate issues in development
**Solution**: The app now automatically falls back to HTTP
- Primary: https://localhost:7000/api
- Fallback: http://localhost:7000/api

### Issue 3: CORS Errors
**Cause**: Backend CORS policy not configured
**Solution**: Ensure your backend has CORS configured for:
- http://localhost:3000
- https://localhost:3000

### Issue 4: Firewall/Antivirus Blocking
**Cause**: Security software blocking connections
**Solution**:
1. Temporarily disable firewall/antivirus
2. Add exceptions for ports 3000 and 7000
3. Use 127.0.0.1 instead of localhost

## Automatic Features Added

✅ **Multiple API URL Fallbacks**: Tries HTTPS, then HTTP, then 127.0.0.1
✅ **Automatic Retry Logic**: Retries failed requests with different URLs
✅ **Connection Status Display**: Shows real-time connection status
✅ **Certificate Error Handling**: Automatically switches to HTTP on SSL errors
✅ **Network Monitoring**: Detects online/offline status

## Environment Variables

The app now supports these environment variables in `.env`:
```
REACT_APP_API_URL=https://localhost:7000/api
REACT_APP_API_FALLBACK_URL=http://localhost:7000/api
HTTPS=false
DISABLE_ESLINT_PLUGIN=true
```

## Testing Connection

The app includes a connection test utility. Check browser console for:
- ✅ Connected to: [URL]
- ❌ Failed to connect to: [URL]

## If All Else Fails

1. Check if backend is actually running on port 7000
2. Try different port: Update both frontend and backend to use port 5000
3. Use IP address instead of localhost: 127.0.0.1:7000
4. Check Windows hosts file: `C:\Windows\System32\drivers\etc\hosts`
5. Restart both frontend and backend services