import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
    setShowMenu(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const closeAllMenus = () => {
    setShowMenu(false);
    setShowUserMenu(false);
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const first = user.firstName?.charAt(0) || '';
    const last = user.lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  };

  const navigationItems = [
    { path: '/', label: 'Home', icon: '🏠', showAlways: true },
    { path: '/dashboard', label: 'Dashboard', icon: '📊', requiresAuth: true },
    { path: '/pets', label: 'My Pets', icon: '🐕', requiresAuth: true },
    { path: '/vaccinations', label: 'Vaccinations', icon: '💉', requiresAuth: true },
    { path: '/symptom-checker', label: 'Symptom Checker', icon: '🔍', requiresAuth: true },
    { path: '/behavior-solver', label: 'Behavior Solver', icon: '🎯', requiresAuth: true },
    { path: '/breed-info', label: 'Breed Info', icon: '📚', requiresAuth: true },
    { path: '/about', label: 'About', icon: 'ℹ️', showAlways: true },
    { path: '/contact', label: 'Contact', icon: '📞', showAlways: true }
  ];

  const filteredNavigation = navigationItems.filter(item => 
    item.showAlways || (item.requiresAuth && isAuthenticated)
  );

  return (
    <header className={`app-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo" onClick={closeAllMenus}>
          <span className="logo-icon">🐾</span>
          <span className="logo-text">PetPulse AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={`nav-menu ${showMenu ? 'active' : ''}`}>
          {filteredNavigation.map(item => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`nav-link ${isActiveRoute(item.path) ? 'active' : ''}`}
              onClick={closeAllMenus}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Actions */}
        <div className="header-actions">
          {isAuthenticated ? (
            <div className="user-menu-container">
              <button 
                className="user-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-expanded={showUserMenu}
                aria-label="User menu"
              >
                <div className="user-avatar">
                  {getUserInitials()}
                </div>
                <div className="user-info">
                  <span className="user-greeting">Hi, {user?.firstName}</span>
                </div>
                <span className="dropdown-arrow">▼</span>
              </button>
              
              {showUserMenu && (
                <div className="dropdown-menu">
                  <div className="user-profile">
                    <div className="user-avatar-large">
                      {getUserInitials()}
                    </div>
                    <div className="user-details">
                      <strong>{user?.firstName} {user?.lastName}</strong>
                      <span>{user?.email}</span>
                    </div>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <Link 
                    to="/dashboard" 
                    className="dropdown-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <span className="item-icon">📊</span>
                    Dashboard
                  </Link>
                  <Link 
                    to="/pets" 
                    className="dropdown-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <span className="item-icon">🐕</span>
                    My Pets
                  </Link>
                  <Link 
                    to="/profile" 
                    className="dropdown-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <span className="item-icon">👤</span>
                    My Profile
                  </Link>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button 
                    onClick={handleLogout}
                    className="dropdown-item logout-btn"
                  >
                    <span className="item-icon">🚪</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className={`mobile-menu-toggle ${showMenu ? 'active' : ''}`}
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Toggle menu"
            aria-expanded={showMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMenu && (
        <div className="mobile-menu-overlay" onClick={closeAllMenus}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              {isAuthenticated ? (
                <div className="mobile-user-info">
                  <div className="user-avatar">{getUserInitials()}</div>
                  <div className="user-details">
                    <strong>{user?.firstName} {user?.lastName}</strong>
                    <span>{user?.email}</span>
                  </div>
                </div>
              ) : (
                <div className="mobile-auth-promo">
                  <h3>Join PetPulse AI</h3>
                  <p>Start managing your pet's health today</p>
                  <div className="mobile-auth-buttons">
                    <Link to="/login" className="btn btn-outline" onClick={closeAllMenus}>
                      Sign In
                    </Link>
                    <Link to="/register" className="btn btn-primary" onClick={closeAllMenus}>
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <nav className="mobile-nav">
              {filteredNavigation.map(item => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`mobile-nav-link ${isActiveRoute(item.path) ? 'active' : ''}`}
                  onClick={closeAllMenus}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              ))}
            </nav>

            {isAuthenticated && (
              <div className="mobile-menu-footer">
                <button 
                  onClick={handleLogout}
                  className="mobile-logout-btn"
                >
                  <span className="logout-icon">🚪</span>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Close dropdowns when clicking outside */}
      {(showUserMenu || showMenu) && (
        <div 
          className="dropdown-backdrop" 
          onClick={closeAllMenus}
        />
      )}
    </header>
  );
};

export default Header;