# PG Finder API Testing Guide

## Base URL
```
https://localhost:7000/api
```

## Authentication
Most endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 1. Authentication APIs

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "Password@123",
  "phone": "9876543210",
  "role": "User"
}
```

### Register Owner
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "PG Owner",
  "email": "owner@example.com",
  "password": "Owner@123",
  "phone": "9876543211",
  "role": "Owner"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password@123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "roleId": 1,
    "role": {
      "roleId": 1,
      "roleName": "User"
    }
  }
}
```

## 2. PG Management APIs

### Get All PGs
```http
GET /api/pg
```

### Get PGs with Filters
```http
GET /api/pg?city=Mumbai&area=Andheri&maxRent=15000
```

### Get Single PG
```http
GET /api/pg/1
```

### Create PG (Owner/Admin only)
```http
POST /api/pg
Authorization: Bearer <owner-token>
Content-Type: application/json

{
  "name": "Comfort PG",
  "address": "123 Sample Street, Andheri East",
  "rent": 8500,
  "genderAllowed": "Male",
  "latitude": 19.1136,
  "longitude": 72.8697,
  "city": "Mumbai",
  "area": "Andheri East"
}
```

### Update PG (Owner/Admin only)
```http
PUT /api/pg/1
Authorization: Bearer <owner-token>
Content-Type: application/json

{
  "name": "Updated PG Name",
  "address": "Updated Address",
  "rent": 9000,
  "genderAllowed": "Both",
  "latitude": 19.1136,
  "longitude": 72.8697,
  "city": "Mumbai",
  "area": "Andheri East",
  "isActive": true
}
```

### Delete PG (Owner/Admin only)
```http
DELETE /api/pg/1
Authorization: Bearer <owner-token>
```

## 3. Booking APIs

### Create Booking
```http
POST /api/bookings
Authorization: Bearer <user-token>
Content-Type: application/json

{
  "pgId": 1
}
```

### Get My Bookings
```http
GET /api/bookings/my
Authorization: Bearer <user-token>
```

## 4. Review APIs

### Add Review
```http
POST /api/review
Authorization: Bearer <user-token>
Content-Type: application/json

{
  "pgId": 1,
  "rating": 4,
  "comment": "Great place to stay! Clean and well-maintained."
}
```

### Get Reviews for PG
```http
GET /api/review/1
```

## 5. Payment APIs

### Make Payment
```http
POST /api/payments/1
Authorization: Bearer <user-token>
```

## Pre-seeded Data

The application comes with pre-seeded data:

### Users:
1. **Admin User**
   - Email: `admin@pgfinder.com`
   - Password: `Admin@123`
   - Role: Admin

2. **PG Owner**
   - Email: `owner@pgfinder.com`
   - Password: `Owner@123`
   - Role: Owner

### Sample PGs:
1. **Sunrise PG** - Male, ₹8,000/month, Andheri East
2. **Green Valley PG** - Female, ₹12,000/month, Bandra West
3. **City Center PG** - Both, ₹10,000/month, Powai

## Testing Steps:

1. **Start the application**: `dotnet run`
2. **Register a new user** or use pre-seeded accounts
3. **Login** to get JWT token
4. **Use the token** in Authorization header for protected endpoints
5. **Test CRUD operations** for PGs, bookings, and reviews

## Common Response Codes:
- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found

## Validation Rules:
- **Email**: Valid email format
- **Password**: 8+ chars, uppercase, lowercase, number, special char
- **Phone**: 10-digit Indian mobile number (starts with 6-9)
- **Name**: 3-50 characters, letters only
- **Rating**: 1-5 range
- **Rent**: 1000-100000 range