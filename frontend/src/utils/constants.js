// Application constants

export const APP_CONFIG = {
  name: 'PetPulse AI',
  version: '2.0.0',
  description: 'Intelligent Pet Health Management Platform',
  homepage: 'https://abhivocopedia.github.io/petpulse-ai',
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://65.20.87.234:5000/api'
};

export const PET_SPECIES = [
  { value: 'dog', label: 'Dog', emoji: '🐕' },
  { value: 'cat', label: 'Cat', emoji: '🐈' },
  { value: 'bird', label: 'Bird', emoji: '🐦' },
  { value: 'rabbit', label: 'Rabbit', emoji: '🐇' },
  { value: 'other', label: 'Other', emoji: '🐾' }
];

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'unknown', label: 'Unknown' }
];

export const WEIGHT_UNITS = [
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'lbs', label: 'Pounds (lbs)' }
];

export const VACCINATION_TYPES = [
  { value: 'core', label: 'Core Vaccine' },
  { value: 'non-core', label: 'Non-Core Vaccine' },
  { value: 'optional', label: 'Optional Vaccine' }
];

export const VACCINATION_STATUS = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'missed', label: 'Missed' },
  { value: 'cancelled', label: 'Cancelled' }
];

export const URGENCY_LEVELS = [
  { value: 'emergency', label: 'Emergency', color: '#dc3545' },
  { value: 'urgent', label: 'Urgent', color: '#ffc107' },
  { value: 'monitor', label: 'Monitor', color: '#28a745' },
  { value: 'routine', label: 'Routine', color: '#6c757d' }
];

export const BEHAVIOR_ISSUES = [
  { value: 'barking', label: 'Excessive Barking' },
  { value: 'chewing', label: 'Destructive Chewing' },
  { value: 'digging', label: 'Digging' },
  { value: 'scratching', label: 'Scratching Furniture' },
  { value: 'aggression', label: 'Aggression' },
  { value: 'anxiety', label: 'Separation Anxiety' },
  { value: 'other', label: 'Other Behavior Issue' }
];

export const COMMON_SYMPTOMS = [
  'vomiting',
  'diarrhea',
  'lethargy',
  'loss of appetite',
  'coughing',
  'sneezing',
  'itching',
  'limping',
  'difficulty breathing',
  'seizure',
  'excessive thirst',
  'weight loss',
  'pale gums',
  'bleeding',
  'swelling',
  'pain',
  'fever',
  'shaking',
  'disorientation',
  'excessive panting',
  'hair loss',
  'redness',
  'discharge from eyes or nose',
  'changes in urination',
  'changes in behavior'
];

export const HEALTH_RECORD_TYPES = [
  { value: 'symptom_check', label: 'Symptom Check' },
  { value: 'behavior_issue', label: 'Behavior Issue' },
  { value: 'vet_visit', label: 'Vet Visit' },
  { value: 'medication', label: 'Medication' },
  { value: 'other', label: 'Other' }
];

export const PRIORITY_LEVELS = [
  { value: 'immediate', label: 'Immediate' },
  { value: 'soon', label: 'Soon' },
  { value: 'long-term', label: 'Long-term' }
];

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language'
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password'
  },
  PETS: {
    BASE: '/pets',
    BREEDS: '/pets/breeds',
    SPECIES: '/pets/species/list'
  },
  VACCINATIONS: {
    BASE: '/vaccinations',
    UPCOMING: '/vaccinations/upcoming/list',
    GENERATE_SCHEDULE: '/vaccinations/generate-schedule'
  },
  HEALTH: {
    RECORDS: '/health/records',
    SYMPTOM_CHECK: '/health/symptom-checker',
    BEHAVIOR_SOLVE: '/health/behavior-solver'
  },
  SYSTEM: {
    HEALTH: '/health',
    STATUS: '/status'
  }
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Your session has expired. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  REGISTER: 'Account created successfully!',
  LOGIN: 'Login successful!',
  PET_ADDED: 'Pet added successfully!',
  PET_UPDATED: 'Pet updated successfully!',
  PET_DELETED: 'Pet deleted successfully!',
  VACCINATION_ADDED: 'Vaccination scheduled successfully!',
  VACCINATION_COMPLETED: 'Vaccination marked as completed!',
  SYMPTOM_ANALYZED: 'Symptoms analyzed successfully!',
  BEHAVIOR_ANALYZED: 'Behavior analysis completed successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!'
};