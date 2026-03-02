import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import "../index.css";

function CareersPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const departments = [
    { id: "all", label: "All Departments" },
    { id: "engineering", label: "Engineering" },
    { id: "product", label: "Product" },
    { id: "sales", label: "Sales" },
    { id: "operations", label: "Operations" },
  ];

  const jobs = [
    { 
      title: "Senior Security Engineer", 
      department: "Engineering", 
      location: "Remote",
      type: "Full-time",
      description: "Design and implement security architecture for our cloud-native platform"
    },
    { 
      title: "Machine Learning Engineer", 
      department: "Engineering", 
      location: "San Francisco, CA",
      type: "Full-time",
      description: "Build ML models for threat detection and anomaly identification"
    },
    { 
      title: "Security Analyst", 
      department: "Operations", 
      location: "Remote",
      type: "Full-time",
      description: "Monitor and respond to security incidents 24/7"
    },
    { 
      title: "DevSecOps Engineer", 
      department: "Engineering", 
      location: "Remote",
      type: "Full-time",
      description: "Integrate security into CI/CD pipelines and infrastructure"
    },
    { 
      title: "Product Manager", 
      department: "Product", 
      location: "San Francisco, CA",
      type: "Full-time",
      description: "Define product strategy and roadmap for security products"
    },
    { 
      title: "Customer Success Manager", 
      department: "Sales", 
      location: "New York, NY",
      type: "Full-time",
      description: "Ensure customer satisfaction and drive adoption"
    },
    { 
      title: "Frontend Engineer", 
      department: "Engineering", 
      location: "Remote",
      type: "Full-time",
      description: "Build beautiful and performant user interfaces"
    },
    { 
      title: "Backend Engineer", 
      department: "Engineering", 
      location: "Remote",
      type: "Full-time",
      description: "Design and build scalable microservices architecture"
    },
  ];

  const filteredJobs = selectedDepartment === "all" 
    ? jobs 
    : jobs.filter(job => job.department.toLowerCase() === selectedDepartment);

  const benefits = [
    { icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", title: "Health & Wellness", description: "Comprehensive health, dental, and vision insurance" },
    { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", title: "Flexible Time Off", description: "Unlimited PTO with minimum vacation policy" },
    { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", title: "Remote First", description: "Work from anywhere in the world" },
    { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "Competitive Salary", description: "Top-of-market compensation and equity" },
    { icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", title: "Learning Budget", description: "$5,000 annual learning and development budget" },
    { icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", title: "Parental Leave", description: "16 weeks paid parental leave for all parents" },
  ];

  const culture = [
    { title: "Innovation First", description: "We encourage experimentation and calculated risk-taking" },
    { title: "Transparency", description: "Open communication at all levels of the organization" },
    { title: "Collaboration", description: "Cross-functional teams working together to solve problems" },
    { title: "Growth Mindset", description: "Continuous learning and personal development" },
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
              Join Our Team
            </span>
          </div>
          <h1 className="product-hero-title">Build the Future of Cybersecurity</h1>
          <p className="product-hero-subtitle">
            Join a team of passionate security experts working together to protect organizations 
            worldwide from evolving cyber threats. We're looking for talented individuals who 
            share our mission.
          </p>
        </div>
      </section>

      <section className="product-section">
        <div className="section-background">
          <div className="bg-gradient"></div>
        </div>
        <div className="product-section-container">
          <div className="section-intro">
            <span className="section-label">Why CyberShield</span>
            <h2>Benefits & Culture</h2>
          </div>
          <div className="capabilities-grid">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="capability-card-3d" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="card-inner">
                  <div className="capability-icon-3d" style={{ background: '#ef444415' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                      <path d={benefit.icon} />
                    </svg>
                    <div className="icon-glow" style={{ background: '#ef4444' }}></div>
                  </div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                  <div className="card-border-glow" style={{ '--glow-color': '#ef4444' }}></div>
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
          <div className="section-intro">
            <span className="section-label">Our Values</span>
            <h2>What Makes Us Different</h2>
          </div>
          <div className="culture-grid">
            {culture.map((item, index) => (
              <div key={index} className="culture-card" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="culture-number">{String(index + 1).padStart(2, '0')}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="product-section">
        <div className="section-background">
          <div className="bg-gradient"></div>
        </div>
        <div className="product-section-container">
          <div className="section-intro">
            <span className="section-label">Open Positions</span>
            <h2>Find Your Next Role</h2>
          </div>
          <div className="departments-filter">
            {departments.map(dept => (
              <button
                key={dept.id}
                className={`dept-btn ${selectedDepartment === dept.id ? "active" : ""}`}
                onClick={() => setSelectedDepartment(dept.id)}
              >
                {dept.label}
              </button>
            ))}
          </div>
          <div className="jobs-list">
            {filteredJobs.map((job, index) => (
              <div key={index} className="job-card" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="job-info">
                  <h3>{job.title}</h3>
                  <p className="job-meta">{job.department} · {job.location} · {job.type}</p>
                  <p className="job-description">{job.description}</p>
                </div>
                <button className="btn btn-outline">Apply Now</button>
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
            <h2>Don't See the Right Role?</h2>
            <p>We're always looking for exceptional talent. Send us your resume and we'll reach out when we have a position that matches your skills.</p>
            <div className="cta-actions">
              <button className="btn btn-primary btn-lg">Submit Your Resume</button>
              <Link to="/contact" className="btn btn-outline btn-lg">Get in Touch</Link>
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
                    <linearGradient id="footerLogoGradCareers" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#f87171" />
                    </linearGradient>
                  </defs>
                  <path d="M20 2L4 10v12c0 9.94 7.16 17.9 16 20 8.84-2.1 16-10.06 16-20V10L20 2z" fill="url(#footerLogoGradCareers)" opacity="0.15" />
                  <path d="M20 4.5L7 11.5v10c0 7.95 5.77 14.32 13 16 7.23-1.68 13-8.05 13-16v-10L20 4.5z" stroke="url(#footerLogoGradCareers)" strokeWidth="2" fill="none" />
                  <path d="M20 12v12M12 16l8 4 8-4" stroke="url(#footerLogoGradCareers)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="20" cy="18" r="3" fill="url(#footerLogoGradCareers)" />
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

export default CareersPage;
