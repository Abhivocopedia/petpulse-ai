import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">🐾</span>
              <span className="logo-text">PetPulse AI</span>
            </div>
            <p className="footer-description">
              Your intelligent pet health companion. 
              Keeping your furry friends healthy and happy with AI-powered insights.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">📘</a>
              <a href="#" className="social-link">🐦</a>
              <a href="#" className="social-link">📷</a>
            </div>
          </div>

          {/* Features Section */}
          <div className="footer-section">
            <h4>Features</h4>
            <ul className="footer-links">
              <li><Link to="/symptom-checker">Symptom Checker</Link></li>
              <li><Link to="/behavior-solver">Behavior Solver</Link></li>
              <li><Link to="/vaccinations">Vaccination Tracker</Link></li>
              <li><Link to="/breed-info">Breed Information</Link></li>
            </ul>
          </div>

          {/* Company Section */}
          <div className="footer-section">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="footer-section">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><a href="mailto:support@petpulse.ai">📧 support@petpulse.ai</a></li>
              <li><a href="tel:+15551234567">📞 +1 (555) 123-4567</a></li>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            © 2025 PetPulse AI. All rights reserved.
          </div>
          <div className="footer-version">
            Version 2.0.0 | Made with ❤️ for pets
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;