// General utility functions

// Format date to readable string
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format date with time
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Calculate age from birth date
export const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  
  const today = new Date();
  const birth = new Date(birthDate);
  
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  return { years, months };
};

// Format age for display
export const formatAge = (age) => {
  if (!age) return 'Unknown';
  
  const { years, months } = age;
  if (years === 0 && months === 0) return 'Newborn';
  if (years === 0) return `${months} month${months !== 1 ? 's' : ''}`;
  if (months === 0) return `${years} year${years !== 1 ? 's' : ''}`;
  
  return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
};

// Convert weight between units
export const convertWeight = (value, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return value;
  
  if (fromUnit === 'kg' && toUnit === 'lbs') {
    return value * 2.20462;
  } else if (fromUnit === 'lbs' && toUnit === 'kg') {
    return value / 2.20462;
  }
  
  return value;
};

// Format weight for display
export const formatWeight = (weight) => {
  if (!weight || weight.value === undefined) return 'N/A';
  return `${weight.value} ${weight.unit}`;
};

// Get species emoji
export const getSpeciesEmoji = (species) => {
  const emojis = {
    dog: '🐕',
    cat: '🐈',
    bird: '🐦',
    rabbit: '🐇',
    other: '🐾'
  };
  return emojis[species] || '🐾';
};

// Get urgency color
export const getUrgencyColor = (urgency) => {
  const colors = {
    emergency: '#dc3545',
    urgent: '#ffc107',
    monitor: '#28a745',
    routine: '#6c757d'
  };
  return colors[urgency] || '#6c757d';
};

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    scheduled: '#007bff',
    completed: '#28a745',
    missed: '#dc3545',
    cancelled: '#6c757d'
  };
  return colors[status] || '#6c757d';
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Generate random ID (for temporary client-side IDs)
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Validate required fields
export const validateRequired = (fields, data) => {
  const errors = {};
  
  fields.forEach(field => {
    if (!data[field] || data[field].toString().trim() === '') {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
  });
  
  return errors;
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Format phone number
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if the number is valid
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
};

// Validate email format
export const isValidEmail = (email) => {
  if (!email) return false;
  
  // Regular expression for basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Alternative email validation with more strict pattern
export const isValidEmailStrict = (email) => {
  if (!email) return false;
  
  // More comprehensive email regex
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

// Password strength validation
export const isStrongPassword = (password, options = {}) => {
  if (!password) return false;
  
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true
  } = options;
  
  // Check minimum length
  if (password.length < minLength) {
    return false;
  }
  
  // Check for uppercase letters
  if (requireUppercase && !/[A-Z]/.test(password)) {
    return false;
  }
  
  // Check for lowercase letters
  if (requireLowercase && !/[a-z]/.test(password)) {
    return false;
  }
  
  // Check for numbers
  if (requireNumbers && !/\d/.test(password)) {
    return false;
  }
  
  // Check for special characters
  if (requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return false;
  }
  
  return true;
};

// Get password strength score and feedback
export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, feedback: [] };
  
  let score = 0;
  const feedback = [];
  
  // Length check
  if (password.length >= 8) score += 1;
  else feedback.push('Password should be at least 8 characters long');
  
  // Uppercase check
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Include at least one uppercase letter');
  
  // Lowercase check
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Include at least one lowercase letter');
  
  // Numbers check
  if (/\d/.test(password)) score += 1;
  else feedback.push('Include at least one number');
  
  // Special characters check
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
  else feedback.push('Include at least one special character');
  
  // Strength rating
  let strength;
  if (score <= 2) strength = 'Weak';
  else if (score <= 3) strength = 'Fair';
  else if (score <= 4) strength = 'Good';
  else strength = 'Strong';
  
  return {
    score,
    strength,
    feedback: feedback.length === 0 ? ['Strong password!'] : feedback,
    isStrong: score >= 4
  };
};

// Simple password validation (basic requirements)
export const isValidPassword = (password) => {
  if (!password) return false;
  return password.length >= 6;
};
