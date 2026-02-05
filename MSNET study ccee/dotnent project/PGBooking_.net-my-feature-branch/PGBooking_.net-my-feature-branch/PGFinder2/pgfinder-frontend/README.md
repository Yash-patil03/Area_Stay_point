# PG Finder Frontend

A modern React TypeScript application for finding and booking PG (Paying Guest) accommodations.

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Form Validation**: Comprehensive client-side validation with regex patterns
- **PG Listings**: Browse available PG accommodations
- **Booking Management**: Create and manage bookings
- **Payment Integration**: Integrated payment processing
- **Responsive Design**: Mobile-friendly UI with modern styling
- **Toast Notifications**: User-friendly feedback messages

## Tech Stack

- **React 18** with TypeScript
- **React Router DOM** for navigation
- **Styled Components** for styling
- **Axios** for API calls
- **React Toastify** for notifications
- **Context API** for state management

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Running .NET backend API

## Installation

1. Navigate to the frontend directory:
```bash
cd pgfinder-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update the API base URL in `src/services/api.ts`:
```typescript
const API_BASE_URL = 'https://localhost:7000/api'; // Update with your backend URL
```

## Running the Application

1. Start the development server:
```bash
npm start
```

2. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.tsx          # Login form with validation
│   │   └── Register.tsx       # Registration form with validation
│   ├── Booking/
│   │   └── BookingList.tsx    # User's bookings management
│   ├── Dashboard/
│   │   └── Dashboard.tsx      # Main dashboard
│   ├── PG/
│   │   └── PGList.tsx         # PG listings
│   └── Navbar.tsx             # Navigation component
├── context/
│   └── AuthContext.tsx        # Authentication context
├── services/
│   └── api.ts                 # API service layer
├── utils/
│   └── validation.ts          # Form validation utilities
├── App.tsx                    # Main app component
└── index.css                  # Global styles
```

## Form Validations

The application includes comprehensive form validations:

### Email Validation
- Required field
- Valid email format using regex: `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`

### Password Validation
- Required field
- Minimum 8 characters
- Must contain:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- Regex: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/`

### Name Validation
- Required field
- Only letters and spaces allowed
- 2-50 characters length
- Regex: `/^[a-zA-Z\s]{2,50}$/`

### Phone Validation (if implemented)
- Required field
- Valid Indian mobile number format
- Regex: `/^[6-9]\d{9}$/`

## API Integration

The frontend integrates with the following backend endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/bookings/my` - Get user's bookings
- `POST /api/bookings` - Create new booking
- `POST /api/payments/{bookingId}` - Process payment
- `POST /api/reviews` - Add review
- `GET /api/reviews/{pgId}` - Get PG reviews

## Styling Features

- **Modern Design**: Gradient backgrounds and glassmorphism effects
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Smooth Animations**: Hover effects and transitions
- **Accessible**: Proper focus states and ARIA labels
- **Toast Notifications**: Beautiful success/error messages

## Authentication Flow

1. User registers with email, name, and password
2. Form validation ensures data integrity
3. Upon successful registration, user is redirected to login
4. Login provides JWT token stored in localStorage
5. Token is automatically included in API requests
6. Protected routes redirect to login if not authenticated

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Environment Variables

Create a `.env` file in the root directory:

```
REACT_APP_API_URL=https://localhost:7000/api
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.