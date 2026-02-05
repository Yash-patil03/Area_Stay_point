// Validation regex patterns
export const validationPatterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  phone: /^[6-9]\d{9}$/,
  name: /^[a-zA-Z\s]{2,50}$/,
  rating: /^[1-5]$/,
};

// Validation functions
export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!validationPatterns.email.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!validationPatterns.password.test(password)) {
    return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
  }
  return null;
};

export const validateName = (name) => {
  if (!name) return 'Name is required';
  if (!validationPatterns.name.test(name)) {
    return 'Name should only contain letters and spaces (2-50 characters)';
  }
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required';
  if (!validationPatterns.phone.test(phone)) {
    return 'Please enter a valid 10-digit Indian mobile number';
  }
  return null;
};

export const validateRating = (rating) => {
  if (!rating) return 'Rating is required';
  if (!validationPatterns.rating.test(rating)) {
    return 'Rating must be between 1 and 5';
  }
  return null;
};

export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};