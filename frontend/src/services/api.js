import axios from 'axios';

// MUST point to VULTR backend - Production URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://65.20.87.234:5000/api';

// Create axios instance with enhanced configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add timestamp to avoid caching issues
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }
    
    console.log(`🔄 API Call: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('🚨 API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Success: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('🚨 API Response Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    if (error.response?.status === 500) {
      console.error('🚨 Server Error - Backend might be down');
    }

    if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
      console.error('🚨 Network Error - Cannot connect to backend');
    }

    return Promise.reject(error);
  }
);

// Health check endpoint
export const healthCheck = () => api.get('/health');

// Auth API
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData)
};

// Pets API
export const petsService = {
  getAll: () => api.get('/pets'),
  getById: (id) => api.get(`/pets/${id}`),
  create: (petData) => api.post('/pets', petData),
  update: (id, petData) => api.put(`/pets/${id}`, petData),
  delete: (id) => api.delete(`/pets/${id}`),
  getBreeds: (species) => api.get(`/pets/breeds/${species}`)
};

// Vaccinations API
export const vaccinationsService = {
  getAll: () => api.get('/vaccinations'),
  getByPet: (petId) => api.get(`/vaccinations/pet/${petId}`),
  create: (vaccinationData) => api.post('/vaccinations', vaccinationData),
  complete: (id, data) => api.put(`/vaccinations/${id}/complete`, data),
  generateSchedule: (petId) => api.post('/vaccinations/generate-schedule', { petId })
};

// Health API
export const healthService = {
  getRecords: () => api.get('/health/records'),
  getPetRecords: (petId) => api.get(`/health/records/pet/${petId}`),
  symptomCheck: (data) => api.post('/health/symptom-checker', data),
  behaviorSolve: (data) => api.post('/health/behavior-solver', data)
};

// Status API
export const statusService = {
  getStatus: () => api.get('/status')
};

export default api;