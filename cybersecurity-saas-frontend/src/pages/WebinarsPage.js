import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import "../index.css";

function WebinarsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Orb {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 100 + 50;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.hue = Math.random() > 0.5 ? 240 : 180;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -this.radius || this.x > canvas.width + this.radius ||
            this.y < -this.radius || this.y > canvas.height + this.radius) {
          this.reset();
        }
      }
      draw() {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, `hsla(${this.hue}, 70%, 60%, 0.15)`);
        gradient.addColorStop(1, `hsla(${this.hue}, 70%, 60%, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const orbs = Array.from({ length: 5 }, () => new Orb());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      orbs.forEach(orb => {
        orb.update();
        orb.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const filters = [
    { id: "all", label: "All Webinars" },
    { id: "live", label: "Live Demos" },
    { id: "recorded", label: "Recorded" },
    { id: "workshop", label: "Workshops" },
  ];

  const webinars = [
    {
      id: 1,
      type: "live",
      title: "Zero Trust Implementation Workshop",
      description: "Hands-on session on implementing zero trust architecture in your organization.",
      speaker: "Sarah Chen, CISO",
      date: "March 15, 2026",
      time: "2:00 PM EST",
      duration: "90 min",
      attendees: 342,
      thumbnail: "workshop",
    },
    {
      id: 2,
      type: "recorded",
      title: "AI Threat Detection Deep Dive",
      description: "Learn how our AI engine detects and prevents advanced persistent threats.",
      speaker: "Dr. Alex Kumar, AI Security Lead",
      date: "Feb 28, 2026",
      duration: "45 min",
      views: "12.5K",
      thumbnail: "ai",
    },
    {
      id: 3,
      type: "live",
      title: "Cloud Security Best Practices",
      description: "Master AWS, Azure, and GCP security configurations with our experts.",
      speaker: "Michael Torres, Cloud Architect",
      date: "March 20, 2026",
      time: "11:00 AM EST",
      duration: "60 min",
      attendees: 156,
      thumbnail: "cloud",
    },
    {
      id: 4,
      type: "recorded",
      title: "SOC 2 Compliance Made Simple",
      description: "A step-by-step guide to achieving and maintaining SOC 2 Type II compliance.",
      speaker: "Jennifer Williams, Compliance Director",
      date: "Feb 15, 2026",
      duration: "55 min",
      views: "8.2K",
      thumbnail: "compliance",
    },
    {
      id: 5,
      type: "workshop",
      title: "Incident Response Tabletop Exercise",
      description: "Interactive scenario-based training for security incident response teams.",
      speaker: "Rachel Green, IR Lead",
      date: "March 25, 2026",
      time: "3:00 PM EST",
      duration: "2 hours",
      attendees: 89,
      thumbnail: "incident",
    },
    {
      id: 6,
      type: "recorded",
      title: "Kubernetes Security Scanning",
      description: "Detect and remediate Kubernetes vulnerabilities before they become threats.",
      speaker: "David Park, DevSecOps Engineer",
      date: "Feb 10, 2026",
      duration: "40 min",
      views: "6.8K",
      thumbnail: "k8s",
    },
  ];

  const filteredWebinars = activeFilter === "all"
    ? webinars
    : webinars.filter(w => w.type === activeFilter);

  return (
    <div className="webinars-page">
      <canvas ref={canvasRef} className="webinars-canvas" />

      <Header />

      <section className="webinars-hero">
        <div className="webinars-hero-bg">
          <div className="grid-lines"></div>
        </div>
        <div className="webinars-hero-content">
          <div className="live-badge">
            <span className="live-dot"></span>
            Live & Recorded Sessions
          </div>
          <h1 className="webinars-title">
            Learn from
            <span className="gradient-text"> Security Experts</span>
          </h1>
          <p className="webinars-subtitle">
            Join live demos, workshops, and deep-dive sessions with industry-leading security professionals.
          </p>
        </div>
        <div className="webinars-visual">
          <div className="video-player-mockup">
            <div className="player-screen">
              <div className="play-button">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="player-waveform">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="wave-bar" style={{ '--delay': i }}></div>
                ))}
              </div>
            </div>
            <div className="player-controls">
              <div className="control-btn">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
              </div>
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <div className="control-btn">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              </div>
              <span className="time">12:34 / 45:00</span>
            </div>
          </div>
        </div>
      </section>

      <section className="webinars-filters">
        <div className="filters-container">
          {filters.map(filter => (
            <button
              key={filter.id}
              className={`filter-btn ${activeFilter === filter.id ? "active" : ""}`}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
              {activeFilter === filter.id && <span className="filter-glow"></span>}
            </button>
          ))}
        </div>
      </section>

      <section className="webinars-grid-section">
        <div className="webinars-grid">
          {filteredWebinars.map((webinar, index) => (
            <div key={webinar.id} className="webinar-card" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="webinar-thumbnail">
                <div className="thumbnail-visual">
                  <div className={`visual-${webinar.thumbnail}`}>
                    <div className="play-overlay">
                      <div className="play-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <span className={`webinar-badge ${webinar.type}`}>
                  {webinar.type === "live" && <span className="live-pulse"></span>}
                  {webinar.type}
                </span>
                <span className="webinar-duration">{webinar.duration}</span>
              </div>
              <div className="webinar-content">
                <h3>{webinar.title}</h3>
                <p>{webinar.description}</p>
                <div className="webinar-speaker">
                  <div className="speaker-avatar">{webinar.speaker.split(' ').map(n => n[0]).join('')}</div>
                  <span>{webinar.speaker}</span>
                </div>
                <div className="webinar-meta">
                  {webinar.date && <span>{webinar.date}</span>}
                  {webinar.time && <span>{webinar.time}</span>}
                  {webinar.attendees && <span>{webinar.attendees} registered</span>}
                  {webinar.views && <span>{webinar.views} views</span>}
                </div>
                <button className={`register-btn ${webinar.type}`}>
                  {webinar.type === "live" ? "Register Now" : "Watch Now"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="speakers-section">
        <div className="speakers-container">
          <div className="section-intro" style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="section-label">Expert Speakers</span>
            <h2>Learn from Industry Leaders</h2>
          </div>
          <div className="speakers-grid">
            <div className="speaker-card">
              <div className="speaker-avatar">SC</div>
              <h3>Sarah Chen</h3>
              <span className="speaker-title">Chief Information Security Officer</span>
              <p>20+ years in enterprise security, former CISO at Fortune 500 companies.</p>
            </div>
            <div className="speaker-card">
              <div className="speaker-avatar">AK</div>
              <h3>Dr. Alex Kumar</h3>
              <span className="speaker-title">VP of AI Security</span>
              <p>PhD in Machine Learning, pioneer in AI-powered threat detection systems.</p>
            </div>
            <div className="speaker-card">
              <div className="speaker-avatar">MT</div>
              <h3>Michael Torres</h3>
              <span className="speaker-title">Cloud Security Architect</span>
              <p>AWS & Azure certified expert, designed security for $1B+ cloud migrations.</p>
            </div>
            <div className="speaker-card">
              <div className="speaker-avatar">JW</div>
              <h3>Jennifer Williams</h3>
              <span className="speaker-title">Compliance Director</span>
              <p>Led 50+ SOC 2 audits, CISA certified, GDPR & CCPA expert.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="webinars-cta">
        <div className="cta-3d-container">
          <div className="cta-visual-3d">
            <div className="cube-container">
              <div className="cube">
                <div className="cube-face cube-front">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="cube-face cube-back"></div>
                <div className="cube-face cube-right"></div>
                <div className="cube-face cube-left"></div>
                <div className="cube-face cube-top"></div>
                <div className="cube-face cube-bottom"></div>
              </div>
            </div>
          </div>
          <div className="cta-content">
            <h2>Host Your Own Webinar</h2>
            <p>Partner with us to deliver security training to your team or customers.</p>
            <Link to="/contact" className="btn btn-primary btn-lg">Become a Speaker</Link>
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
                    <linearGradient id="footerLogoGradWeb" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#f87171" />
                    </linearGradient>
                  </defs>
                  <path d="M20 2L4 10v12c0 9.94 7.16 17.9 16 20 8.84-2.1 16-10.06 16-20V10L20 2z" fill="url(#footerLogoGradWeb)" opacity="0.15" />
                  <path d="M20 4.5L7 11.5v10c0 7.95 5.77 14.32 13 16 7.23-1.68 13-8.05 13-16v-10L20 4.5z" stroke="url(#footerLogoGradWeb)" strokeWidth="2" fill="none" />
                  <path d="M20 12v12M12 16l8 4 8-4" stroke="url(#footerLogoGradWeb)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="20" cy="18" r="3" fill="url(#footerLogoGradWeb)" />
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

export default WebinarsPage;
