# PG Finder Test Credentials

## Pre-seeded Accounts (Backend automatically creates these):

### Admin Account
- Email: admin@pgfinder.com
- Password: Admin@123
- Role: Admin

### PG Owner Account  
- Email: owner@pgfinder.com
- Password: Owner@123
- Role: Owner

## Sample Registration Data:

### New User Registration
```json
{
  "fullName": "John Doe",
  "email": "john@example.com", 
  "password": "Password@123",
  "phone": "9876543210",
  "role": "User"
}
```

### New Owner Registration
```json
{
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "password": "Owner@123", 
  "phone": "9876543211",
  "role": "Owner"
}
```

## Sample PG Data (Pre-seeded):
1. **Sunrise PG** - Male, ₹8,000/month, Andheri East
2. **Green Valley PG** - Female, ₹12,000/month, Bandra West  
3. **City Center PG** - Both, ₹10,000/month, Powai

## How to Test:
1. Run `start-app.bat` to start both backend and frontend
2. Go to http://localhost:3000
3. Register a new account or login with pre-seeded credentials
4. Browse PGs and test booking functionality