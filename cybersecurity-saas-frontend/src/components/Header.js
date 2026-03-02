import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../index.css";

function Header({ showAuthButtons = true }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState(null);
  const [clickedDropdown, setClickedDropdown] = useState(null);
  const dropdownTimeoutRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setHoveredDropdown(null);
    setClickedDropdown(null);
  }, [location]);

  const handleMouseEnter = (index) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setHoveredDropdown(index);
    setClickedDropdown(index);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setHoveredDropdown(null);
    }, 150);
  };

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
  };

  const handleDropdownMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setHoveredDropdown(null);
      setClickedDropdown(null);
    }, 150);
  };

  const handleDropdownClick = (index) => {
    if (clickedDropdown === index) {
      setClickedDropdown(null);
      setHoveredDropdown(null);
    } else {
      setClickedDropdown(index);
      setHoveredDropdown(index);
    }
  };

  const closeDropdowns = () => {
    setHoveredDropdown(null);
    setClickedDropdown(null);
    setMobileMenuOpen(false);
  };

  const isDropdownOpen = (index) => {
    return hoveredDropdown === index || clickedDropdown === index;
  };

  const navItems = [
    {
      label: "Products",
      dropdown: [
        { label: "ZTNA", description: "Zero Trust Network Access", path: "/ztna-page", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
        { label: "SOAR", description: "Security Orchestration", path: "/soar-page", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
        { label: "RASP", description: "Runtime Protection", path: "/rasp-page", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
        { label: "SBOM", description: "Software Bill of Materials", path: "/sbom-page", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
      ]
    },
    {
      label: "Solutions",
      dropdown: [
        { label: "Cloud Security", description: "AWS, Azure, GCP", path: "/cloud-security", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
        { label: "Threat Detection", description: "AI-Powered Detection", path: "/threat-detection", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
        { label: "Incident Response", description: "Automated Response", path: "/incident-response", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
        { label: "Compliance", description: "SOC2, ISO, GDPR", path: "/compliance-page", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
      ]
    },
    {
      label: "Resources",
      dropdown: [
        { label: "Documentation", description: "API & Setup Guides", path: "/documentation", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
        { label: "Blog", description: "Security Insights", path: "/blog", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
        { label: "Webinars", description: "Live Demos", path: "/webinars", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
        { label: "Case Studies", description: "Customer Success", path: "/case-studies", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
      ]
    },
    {
      label: "Company",
      dropdown: [
        { label: "About Us", description: "Our Mission", path: "/about", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
        { label: "Careers", description: "Join Our Team", path: "/careers", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
        { label: "Contact", description: "Get in Touch", path: "/contact", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
      ]
    },
  ];

  const isLandingPage = location.pathname === "/" || location.pathname === "/landing";

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeDropdowns}>
          <svg className="logo-icon" viewBox="0 0 40 40" fill="none">
            <defs>
              <linearGradient id="logoGradHeader" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#f87171" />
              </linearGradient>
            </defs>
            <path
              d="M20 2L4 10v12c0 9.94 7.16 17.9 16 20 8.84-2.1 16-10.06 16-20V10L20 2z"
              fill="url(#logoGradHeader)"
              opacity="0.15"
            />
            <path
              d="M20 4.5L7 11.5v10c0 7.95 5.77 14.32 13 16 7.23-1.68 13-8.05 13-16v-10L20 4.5z"
              stroke="url(#logoGradHeader)"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M20 12v12M12 16l8 4 8-4"
              stroke="url(#logoGradHeader)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="20" cy="18" r="3" fill="url(#logoGradHeader)" />
          </svg>
          <span className="logo-text">
            Cyber<span className="logo-accent">Shield</span>
          </span>
        </Link>
        
        <div className={`navbar-menu ${mobileMenuOpen ? "open" : ""}`}>
          <div className="navbar-links">
            {navItems.map((item, index) => (
              <div 
                key={index} 
                className="nav-dropdown"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className="nav-dropdown-trigger"
                  onClick={() => handleDropdownClick(index)}
                >
                  {item.label}
                  <svg
                    className={`dropdown-arrow ${isDropdownOpen(index) ? "active" : ""}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div 
                  className={`nav-dropdown-menu ${isDropdownOpen(index) ? "active" : ""}`}
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  <div className="dropdown-menu-glow"></div>
                  {item.dropdown.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      to={subItem.path}
                      className="nav-dropdown-item"
                      onClick={closeDropdowns}
                    >
                      <div className="dropdown-icon-wrapper">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d={subItem.icon} />
                        </svg>
                      </div>
                      <div className="dropdown-item-content">
                        <div className="dropdown-item-label">{subItem.label}</div>
                        <div className="dropdown-item-desc">{subItem.description}</div>
                      </div>
                      <svg className="dropdown-item-arrow" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            {isLandingPage && (
              <>
                <a href="#features" className="nav-link" onClick={closeDropdowns}>
                  Features
                </a>
                <a href="#pricing" className="nav-link" onClick={closeDropdowns}>
                  Pricing
                </a>
              </>
            )}
            {!isLandingPage && (
              <>
                <Link to="/features" className="nav-link" onClick={closeDropdowns}>
                  Features
                </Link>
                <Link to="/pricing" className="nav-link" onClick={closeDropdowns}>
                  Pricing
                </Link>
              </>
            )}
            <div className="mobile-auth-buttons">
              <Link to="/login" className="btn btn-ghost btn-block-mobile" onClick={closeDropdowns}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-block-mobile" onClick={closeDropdowns}>
                Get Started
              </Link>
            </div>
          </div>
        </div>

        {showAuthButtons && (
          <div className="navbar-auth">
            <Link to="/login" className="btn btn-ghost">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        )}

        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
    </nav>
  );
}

export default Header;
