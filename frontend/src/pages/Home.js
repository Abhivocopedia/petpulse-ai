import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: '🔍',
      title: 'AI Symptom Checker',
      description: 'Get instant AI-powered analysis of your pet\'s symptoms with urgency assessment.'
    },
    {
      icon: '💉',
      title: 'Vaccination Tracker',
      description: 'Never miss a vaccination with smart scheduling and automatic reminders.'
    },
    {
      icon: '🎯',
      title: 'Behavior Solver',
      description: 'Solve common behavior problems with step-by-step training guides.'
    },
    {
      icon: '🐕',
      title: 'Pet Profiles',
      description: 'Manage all your pets in one place with comprehensive health profiles.'
    },
    {
      icon: '📊',
      title: 'Health Dashboard',
      description: 'Get a complete overview of your pet\'s health and upcoming needs.'
    },
    {
      icon: '📚',
      title: 'Breed Information',
      description: 'Learn about different breeds and their specific care requirements.'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              🐾 Keep Your Pets 
              <span className="highlight"> Healthy & Happy</span>
            </h1>
            <p className="hero-description">
              PetPulse AI is your intelligent pet health companion. 
              Get AI-powered insights, track vaccinations, solve behavior issues, 
              and ensure your furry friends get the best care possible.
            </p>
            <div className="hero-actions">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary btn-large">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-large">
                    Get Started Free
                  </Link>
                  <Link to="/about" className="btn btn-outline btn-large">
                    Learn More
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hero-visual">
            <div className="pet-illustration">
              <div className="pet-dog">🐕</div>
              <div className="pet-cat">🐈</div>
              <div className="pet-bird">🐦</div>
              <div className="health-bubble">💖</div>
              <div className="health-bubble">💉</div>
              <div className="health-bubble">🥕</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Everything You Need for Your Pet's Health</h2>
            <p>Comprehensive tools and AI-powered insights to keep your pets in perfect health</p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Give Your Pets the Best Care?</h2>
            <p>Join thousands of pet owners who trust PetPulse AI for their pet's health management.</p>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-primary btn-large">
                Start Your Free Account
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;