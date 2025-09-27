// Authentication constants
export const AUTH_CONSTANTS = {
  // Token management
  TOKEN_KEY: 'access_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  
  // Form validation
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  
  // API endpoints
  ENDPOINTS: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    VERIFY_EMAIL: '/auth/verify-email',
    SEND_VERIFICATION: '/auth/send-verification',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
    REQUEST_EMAIL_CHANGE: '/auth/request-email-change',
    CONFIRM_EMAIL_CHANGE: '/auth/confirm-email-change',
    REFRESH_TOKEN: '/auth/refresh'
  },
  
  // Error messages
  ERROR_MESSAGES: {
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_INVALID: 'Please enter a valid email address',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
    PASSWORD_WEAK: 'Password must include upper/lowercase letters and numbers',
    USERNAME_REQUIRED: 'Username is required',
    USERNAME_TOO_SHORT: 'Username must be at least 3 characters',
    USERNAME_TOO_LONG: 'Username cannot exceed 30 characters',
    PASSWORDS_DONT_MATCH: "Passwords don't match",
    NETWORK_ERROR: 'Network error. Please check your internet connection',
    INVALID_CREDENTIALS: 'Incorrect email or password',
    EMAIL_NOT_VERIFIED: 'Please verify your email address first',
    USER_INACTIVE: 'Your account is not active',
    EMAIL_ALREADY_EXISTS: 'This email address is already in use'
  },
  
  // Success messages
  SUCCESS_MESSAGES: {
    REGISTER_SUCCESS: 'Your account has been created. A verification code was sent to your email.',
    LOGIN_SUCCESS: 'Login successful!',
    LOGOUT_SUCCESS: 'Logged out',
    EMAIL_VERIFIED: 'Your email has been verified successfully!',
    VERIFICATION_SENT: 'Verification code has been sent to your email',
    PROFILE_UPDATED: 'Your profile has been updated',
    PASSWORD_CHANGED: 'Your password has been changed',
    EMAIL_CHANGE_REQUESTED: 'Verification code sent to your new email',
    EMAIL_CHANGED: 'Your email has been updated successfully'
  }
}

// Form validation rules
export const VALIDATION_RULES = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: AUTH_CONSTANTS.ERROR_MESSAGES.EMAIL_INVALID
  },
  password: {
    required: true,
    minLength: AUTH_CONSTANTS.PASSWORD_MIN_LENGTH,
    // Only enforce minimum length and character variety
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    message: AUTH_CONSTANTS.ERROR_MESSAGES.PASSWORD_WEAK
  },
  username: {
    required: true,
    minLength: AUTH_CONSTANTS.USERNAME_MIN_LENGTH,
    maxLength: AUTH_CONSTANTS.USERNAME_MAX_LENGTH,
    pattern: /^\w+$/,
    message: 'Username can only contain letters, numbers, and underscores'
  }
} 