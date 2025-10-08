// Static application constants
export const APP_CONSTANTS = {
  // App metadata
  APP_NAME: 'Discountmithra',
  APP_VERSION: '1.0.0',
  
  // API configuration
  API_TIMEOUT: 30000, // 30 seconds
  CACHE_TTL: 300000, // 5 minutes
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // Validation
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  PHONE_REGEX: /^[6-9]\d{9}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // UI constants
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  
  // File upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  
  // Payment
  SUPPORTED_CURRENCIES: ['INR'],
  MIN_PAYMENT_AMOUNT: 1, // 1 paise
  MAX_PAYMENT_AMOUNT: 10000000, // 1 crore paise
} as const;

// Category configuration
export const CATEGORIES = [
  { id: "1", title: "Food", subtitle: "Restaurants & Takeaway", icon: "fast-food", color: "#FF6B6B", route: "dine-out" },
  { id: "2", title: "Healthcare", subtitle: "Hospitals & Clinics", icon: "medkit", color: "#4ECDC4", route: "healthcare" },
  { id: "4", title: "Home Services", subtitle: "Repair & Maintenance", icon: "build", color: "#FFA502", route: "home-services" },
  { id: "8", title: "Events", subtitle: "Event Management", icon: "calendar", color: "#27AE60", route: "events" },
  { id: "12", title: "Shopping", subtitle: "Malls & Fashion", icon: "shirt", color: "#7c3aed", route: "shopping" },
  { id: "13", title: "Construction", subtitle: "Building & Materials", icon: "construct", color: "#EAB308", route: "construction" },
  { id: "6", title: "Beauty & Salon", subtitle: "Hair & Beauty Care", icon: "color-palette", color: "#B53471", route: "beauty-salon" },
  { id: "14", title: "Others", subtitle: "Custom Service Requests", icon: "add-circle", color: "#6B46C1", route: "others-detail" },
  // Coming soon categories
  { id: "3", title: "Travel", subtitle: "Hotels & Booking", icon: "airplane", color: "#45B7D1", comingSoon: true },
  { id: "5", title: "Automobiles", subtitle: "Car & Bike Services", icon: "car-sport", color: "#3742FA", comingSoon: true },
  { id: "7", title: "Bar", subtitle: "Drinks & Nightlife", icon: "wine", color: "#8E44AD", comingSoon: true },
  { id: "9", title: "Financial Services", subtitle: "Banking & Insurance", icon: "cash", color: "#16A085", comingSoon: true },
  { id: "10", title: "Education", subtitle: "Schools & Coaching", icon: "school", color: "#E67E22", comingSoon: true },
  { id: "11", title: "Electronics", subtitle: "Tech & Gadgets", icon: "phone-portrait", color: "#2C3E50", comingSoon: true },
] as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  AUTH_ERROR: 'Authentication failed. Please login again.',
  PERMISSION_ERROR: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  PAYMENT_FAILED: 'Payment failed. Please try again.',
  SUBSCRIPTION_FAILED: 'Subscription failed. Please try again.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  FORM_SUBMITTED: 'Form submitted successfully!',
  PAYMENT_SUCCESS: 'Payment completed successfully!',
  SUBSCRIPTION_SUCCESS: 'Subscription activated successfully!',
  REVIEW_ADDED: 'Review added successfully!',
} as const;

// Loading messages
export const LOADING_MESSAGES = {
  LOADING: 'Loading...',
  SUBMITTING: 'Submitting...',
  PROCESSING: 'Processing...',
  UPLOADING: 'Uploading...',
  SAVING: 'Saving...',
} as const;

// Default values
export const DEFAULTS = {
  USER_ROLE: 'normal' as const,
  LANGUAGE: 'en' as const,
  CURRENCY: 'INR' as const,
  TIMEZONE: 'Asia/Kolkata' as const,
} as const;
