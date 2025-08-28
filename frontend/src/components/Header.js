import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Navigation items - because apparently we need to know where to go
  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/kanban', label: 'Kanban', icon: '📋' },
    { path: '/tasks', label: 'Tasks', icon: '📝' },
    { path: '/tasks/new', label: 'New Task', icon: '➕' },
    { path: '/statistics', label: 'Statistics', icon: '📈' }
  ];

  // Toggle mobile menu - because apparently mobile users exist
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when route changes - because apparently we need to be user-friendly
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Check if a nav item is active - because apparently we need to highlight current page
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo and title - because apparently we need branding */}
        <div className="header-brand">
          <Link to="/" className="header-logo">
            <span className="header-icon">✅</span>
            <h1 className="header-title">Go Nimbly</h1>
          </Link>
        </div>

        {/* Desktop navigation - because apparently desktop users exist */}
        <nav className="header-nav desktop-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile menu button - because apparently mobile users need a button */}
        <button
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </span>
        </button>
      </div>

      {/* Mobile navigation - because apparently mobile users need navigation too */}
      <nav className={`header-nav mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Header;
