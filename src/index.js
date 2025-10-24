import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Create root and render app
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance monitoring
console.log('🚀 PetPulse AI Frontend Started');
console.log('📍 Version: 2.0.0');
console.log('🌐 Environment: Production');
console.log('🔗 API Base URL:', process.env.REACT_APP_API_BASE_URL);
console.log('🏠 Homepage:', process.env.REACT_APP_HOMEPAGE);

// Error boundary for the entire app
window.addEventListener('error', (event) => {
  console.error('🚨 Global Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 Unhandled Promise Rejection:', event.reason);
});

// Service Worker registration (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}