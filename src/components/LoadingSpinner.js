import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  text = 'Loading...',
  centered = false 
}) => {
  const sizeClasses = {
    small: 'loading-spinner-small',
    medium: 'loading-spinner-medium',
    large: 'loading-spinner-large'
  };

  const colorClasses = {
    primary: 'loading-spinner-primary',
    secondary: 'loading-spinner-secondary',
    white: 'loading-spinner-white'
  };

  const wrapperClass = centered ? 'loading-spinner-centered' : 'loading-spinner-inline';

  return (
    <div className={`loading-spinner ${wrapperClass}`}>
      <div className={`spinner ${sizeClasses[size]} ${colorClasses[color]}`}></div>
      {text && <div className="loading-text">{text}</div>}
    </div>
  );
};

export default LoadingSpinner;