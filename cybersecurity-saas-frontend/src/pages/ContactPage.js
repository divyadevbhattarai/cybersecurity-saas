import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import "../index.css";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contactInfo = [
    { 
      title: "Sales Inquiries", 
      description: "Talk to our sales team about pricing and solutions",
      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      email: "sales@cybershield.com",
      phone: "+1 (555) 123-4567"
    },
    { 
      title: "Technical Support", 
      description: "Get help with any technical issues",
      icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.879 16.121l-3.536-3.536M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      email: "support@cybershield.com",
      phone: "+1 (555) 987-6543"
    },
    { 
      title: "Partnerships", 
      description: "Explore partnership opportunities",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      email: "partners@cybershield.com",
      phone: "+1 (555) 246-8135"
    },
    { 
      title: "Media & Press", 
      description: "For media inquiries and press releases",
      icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
      email: "press@cybershield.com",
      phone: "+1 (555) 369-2580"
    },
  ];

  const offices = [
    { city: "San Francisco", country: "USA", address: "100 Security Way, San Francisco, CA 94102" },
    { city: "New York", country: "USA", address: "350 Fifth Avenue, New York, NY 10118" },
    { city: "London", country: "UK", address: "25 Canada Square, London E14 5LQ" },
    { city: "Singapore", country: "Singapore", address: "1 Raffles Place, Singapore 048616" },
  ];

  return (
    <div className="product-page">
      <Header />

      <section className="product-hero" style={{ "--gradient": "linear-gradient(135deg, #ef4444 0%, #f87171 100%)" }}>
        <div className="product-hero-bg">
          <div className="product-grid-pattern"></div>
          <div className="hero-particles">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="particle" style={{ '--i': i }}></div>
            ))}
          </div>
        </div>
        <div className="product-hero-content" style={{ textAlign: "center", maxWidth: "900px" }}>
          <div className="hero-badges" style={{ justifyContent: "center" }}>
            <span className="product-badge">
              <span className="badge-dot"></span>
              Contact Us
            </span>
          </div>
          <h1 className="product-hero-title">Get in Touch</h1>
          <p className="product-hero-subtitle">
            Have questions about our products or services? Our team is here to help. 
            Reach out through any of the channels below.
          </p>
        </div>
      </section>

      <section className="product-section">
        <div className="section-background">
          <div className="bg-gradient"></div>
        </div>
        <div className="product-section-container">
          <div className="section-intro">
            <span className="section-label">Contact Information</span>
            <h2>How Can We Help?</h2>
          </div>
          <div className="contact-info-grid">
            {contactInfo.map((info, index) => (
              <div key={index} className="contact-info-card" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="contact-icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                    <path d={info.icon} />
                  </svg>
                </div>
                <h3>{info.title}</h3>
                <p>{info.description}</p>
                <div className="contact-details">
                  <a href={`mailto:${info.email}`}>{info.email}</a>
                  <span>{info.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="product-section">
        <div className="section-background">
          <div className="bg-grid"></div>
        </div>
        <div className="product-section-container">
          <div className="contact-form-container">
            <div className="contact-form-header">
              <h2>Send Us a Message</h2>
              <p>Fill out the form below and we'll get back to you within 24 hours.</p>
            </div>
            {submitted ? (
              <div className="form-success">
                <svg viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. We'll get back to you shortly.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Work Email</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="john@company.com"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Company</label>
                    <input 
                      type="text" 
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      placeholder="Acme Inc."
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Subject</label>
                    <select 
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="sales">Sales Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="media">Media & Press</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="How can we help you?"
                    rows="5"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-lg">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="product-section">
        <div className="section-background">
          <div className="bg-gradient"></div>
        </div>
        <div className="product-section-container">
          <div className="section-intro">
            <span className="section-label">Global Presence</span>
            <h2>Our Offices</h2>
          </div>
          <div className="offices-grid">
            {offices.map((office, index) => (
              <div key={index} className="office-card" style={{ animationDelay: `${index * 100}ms` }}>
                <h3>{office.city}</h3>
                <span className="office-country">{office.country}</span>
                <p>{office.address}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="product-cta">
        <div className="cta-3d-bg">
          <div className="cta-particles"></div>
        </div>
        <div className="product-cta-container">
          <div className="cta-content">
            <h2>Need Immediate Assistance?</h2>
            <p>Check our documentation or browse our help center for quick answers to common questions.</p>
            <div className="cta-actions">
              <Link to="/documentation" className="btn btn-primary btn-lg">View Documentation</Link>
              <Link to="/support" className="btn btn-outline btn-lg">Help Center</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-main">
            <div className="footer-brand">
              <Link to="/" className="footer-logo">
                <svg className="logo-icon" viewBox="0 0 40 40" fill="none">
                  <defs>
                    <linearGradient id="footerLogoGradContact" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#f87171" />
                    </linearGradient>
                  </defs>
                  <path d="M20 2L4 10v12c0 9.94 7.16 17.9 16 20 8.84-2.1 16-10.06 16-20V10L20 2z" fill="url(#footerLogoGradContact)" opacity="0.15" />
                  <path d="M20 4.5L7 11.5v10c0 7.95 5.77 14.32 13 16 7.23-1.68 13-8.05 13-16v-10L20 4.5z" stroke="url(#footerLogoGradContact)" strokeWidth="2" fill="none" />
                  <path d="M20 12v12M12 16l8 4 8-4" stroke="url(#footerLogoGradContact)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="20" cy="18" r="3" fill="url(#footerLogoGradContact)" />
                </svg>
                <span>CyberShield</span>
              </Link>
              <p className="footer-tagline">Enterprise-grade cybersecurity for the modern cloud.</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 CyberShield. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ContactPage;
