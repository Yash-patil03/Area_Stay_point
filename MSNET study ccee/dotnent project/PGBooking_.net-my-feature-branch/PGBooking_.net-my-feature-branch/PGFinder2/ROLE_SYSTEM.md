# Role-Based Authentication System

## User Roles & Permissions

### 1. User (Default)
- View PG listings
- Book PGs
- View own bookings
- Add reviews

### 2. Owner
- All User permissions
- Add new PGs
- Manage own PGs (view, edit, delete)
- View bookings for own PGs

### 3. Admin
- All permissions
- Manage all users (view, delete)
- Manage all PGs (view, delete)
- View all bookings
- System administration

## Navigation Menu by Role

### User Menu:
- Dashboard
- Find PGs
- My Bookings

### Owner Menu (Additional):
- My PGs
- Add PG

### Admin Menu (Additional):
- Manage Users
- Manage PGs
- All Bookings

## Protected Routes

### Authentication Required:
- `/dashboard`
- `/pgs`
- `/pg/:id`
- `/bookings`

### Admin Only:
- `/admin/users`
- `/admin/pgs`
- `/admin/bookings`

### Owner Only:
- `/owner/pgs`
- `/owner/add-pg`

## Backend API Endpoints

### Admin Endpoints:
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/{id}` - Delete user
- `GET /api/admin/bookings` - Get all bookings

### Owner Endpoints:
- `GET /api/owner/pgs` - Get owner's PGs
- `POST /api/owner/pgs` - Add new PG
- `PUT /api/owner/pgs/{id}` - Update PG
- `DELETE /api/owner/pgs/{id}` - Delete PG

## Test Accounts

### Admin Account:
- Email: admin@pgfinder.com
- Password: Admin@123
- Role: Admin

### Owner Account:
- Email: owner@pgfinder.com
- Password: Owner@123
- Role: Owner

## Features Implemented:

1. **Dynamic Navbar** - Shows different menu items based on user role
2. **Protected Routes** - Role-based access control
3. **Admin Panel** - User and PG management
4. **Owner Panel** - PG creation and management
5. **JWT Authentication** - Secure token-based auth
6. **Role Validation** - Backend role verification

## Usage:

1. Login with admin/owner account
2. Navbar will show role-specific menu items
3. Access protected routes based on role
4. Admin can manage users and all PGs
5. Owner can add and manage their own PGs