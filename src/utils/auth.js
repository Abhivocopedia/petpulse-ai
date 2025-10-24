// Authentication utility functions

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Get stored token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Store authentication data
export const setAuthData = (token, userData) => {
  localStorage.setItem('token', token);
  if (userData) {
    localStorage.setItem('user', JSON.stringify(userData));
  }
};

// Clear authentication data
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get user data from localStorage
export const getUserData = () => {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Check if token is expired (basic check)
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const isStrongPassword = (password) => {
  return password.length >= 6;
};

// Format user name for display
export const formatUserName = (user) => {
  if (!user) return '';
  return `${user.firstName} ${user.lastName}`.trim();
};

// Get user initials for avatar
export const getUserInitials = (user) => {
  if (!user) return 'U';
  const first = user.firstName?.charAt(0) || '';
  const last = user.lastName?.charAt(0) || '';
  return (first + last).toUpperCase() || 'U';
};