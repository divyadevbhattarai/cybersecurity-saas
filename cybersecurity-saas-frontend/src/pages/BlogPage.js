import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import "../index.css";

function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5 ? "#ef4444" : "#f87171";
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
      }
    }

    for (let i = 0; i < 80; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = "#ef4444";
            ctx.globalAlpha = 0.1 * (1 - dist / 120);
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const categories = [
    { id: "all", label: "All Posts" },
    { id: "threat-intel", label: "Threat Intelligence" },
    { id: "cloud-security", label: "Cloud Security" },
    { id: "compliance", label: "Compliance" },
    { id: "ai-security", label: "AI Security" },
  ];

  const posts = [
    {
      id: 1,
      category: "threat-intel",
      title: "The Rise of AI-Powered Cyber Attacks: What You Need to Know",
      excerpt: "Discover how threat actors are leveraging artificial intelligence to launch more sophisticated and targeted attacks against enterprises.",
      author: "Dr. Sarah Chen",
      date: "Feb 28, 2026",
      readTime: "8 min read",
      image: "ai-attack",
      featured: true,
    },
    {
      id: 2,
      category: "cloud-security",
      title: "Zero Trust Architecture: Implementation Best Practices",
      excerpt: "A comprehensive guide to implementing zero trust security in multi-cloud environments with real-world examples.",
      author: "Michael Torres",
      date: "Feb 25, 2026",
      readTime: "12 min read",
      image: "zero-trust",
    },
    {
      id: 3,
      category: "compliance",
      title: "Navigating SOC 2 Type II: A Complete Audit Preparation Guide",
      excerpt: "Everything you need to know about preparing for and passing your SOC 2 Type II audit with minimal friction.",
      author: "Jennifer Williams",
      date: "Feb 22, 2026",
      readTime: "10 min read",
      image: "soc2",
    },
    {
      id: 4,
      category: "ai-security",
      title: "Securing Machine Learning Models Against Adversarial Attacks",
      excerpt: "Learn how to protect your ML infrastructure from adversarial attacks that can manipulate model outputs.",
      author: "Dr. Alex Kumar",
      date: "Feb 18, 2026",
      readTime: "15 min read",
      image: "ml-security",
    },
    {
      id: 5,
      category: "cloud-security",
      title: "Kubernetes Security: Common Misconfigurations and How to Fix Them",
      excerpt: "Identify and remediate the most dangerous Kubernetes security misconfigurations before they become vulnerabilities.",
      author: "David Park",
      date: "Feb 15, 2026",
      readTime: "9 min read",
      image: "k8s",
    },
    {
      id: 6,
      category: "threat-intel",
      title: "Ransomware Evolution: From Encryption to Data Exfiltration",
      excerpt: "Understanding the modern ransomware threat landscape and how double extortion has changed the game.",
      author: "Rachel Green",
      date: "Feb 12, 2026",
      readTime: "11 min read",
      image: "ransomware",
    },
  ];

  const filteredPosts = selectedCategory === "all" 
    ? posts 
    : posts.filter(p => p.category === selectedCategory);

  const featuredPost = filteredPosts.find(p => p.featured) || filteredPosts[0];
  const otherPosts = filteredPosts.filter(p => p !== featuredPost);

  return (
    <div className="blog-page">
      <canvas ref={canvasRef} className="blog-canvas" />

      <Header />

      <section className="blog-hero">
        <div className="blog-hero-bg">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
        </div>
        <div className="blog-hero-content">
          <div className="blog-badge">
            <span className="badge-pulse"></span>
            Security Insights & Research
          </div>
          <h1 className="blog-title">
            Stay Ahead of
            <span className="gradient-text"> Cyber Threats</span>
          </h1>
          <p className="blog-subtitle">
            Expert analysis, threat intelligence, and best practices from our security research team.
          </p>
        </div>
        <div className="blog-hero-stats">
          <div className="blog-stat">
            <span className="stat-number">150+</span>
            <span className="stat-text">Articles</span>
          </div>
          <div className="blog-stat">
            <span className="stat-number">50K+</span>
            <span className="stat-text">Readers</span>
          </div>
          <div className="blog-stat">
            <span className="stat-number">Weekly</span>
            <span className="stat-text">Updates</span>
          </div>
        </div>
      </section>

      <section className="blog-categories">
        <div className="categories-container">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-btn ${selectedCategory === cat.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
              {selectedCategory === cat.id && <span className="category-indicator"></span>}
            </button>
          ))}
        </div>
      </section>

      <section className="blog-content">
        <div className="blog-container">
          {featuredPost && (
            <article className="featured-post">
              <div className="featured-post-visual">
                <div className="featured-3d-card">
                  <div className="card-glow"></div>
                  <div className="card-content">
                    <div className="card-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="card-pattern"></div>
                  </div>
                </div>
              </div>
              <div className="featured-post-content">
                <span className="post-category">{featuredPost.category.replace('-', ' ')}</span>
                <h2>{featuredPost.title}</h2>
                <p>{featuredPost.excerpt}</p>
                <div className="post-meta">
                  <div className="post-author">
                    <div className="author-avatar">{featuredPost.author.split(' ').map(n => n[0]).join('')}</div>
                    <span>{featuredPost.author}</span>
                  </div>
                  <span className="post-date">{featuredPost.date}</span>
                  <span className="post-read-time">{featuredPost.readTime}</span>
                </div>
                <button className="read-more-btn">
                  Read Article
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </article>
          )}

          <div className="posts-grid">
            {otherPosts.map((post, index) => (
              <article key={post.id} className="post-card" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="post-card-visual">
                  <div className="post-3d-element">
                    <div className="element-core"></div>
                    <div className="element-ring element-ring-1"></div>
                    <div className="element-ring element-ring-2"></div>
                    <div className="element-ring element-ring-3"></div>
                  </div>
                </div>
                <div className="post-card-content">
                  <span className="post-category-small">{post.category.replace('-', ' ')}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="post-meta-small">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="blog-newsletter">
        <div className="newsletter-container">
          <div className="newsletter-visual">
            <div className="newsletter-3d">
              <div className="envelope">
                <div className="envelope-flap"></div>
                <div className="envelope-body">
                  <div className="envelope-shine"></div>
                </div>
              </div>
              <div className="floating-particles">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="particle" style={{ '--i': i }}></div>
                ))}
              </div>
            </div>
          </div>
          <div className="newsletter-content">
            <h2>Subscribe to Our Newsletter</h2>
            <p>Get the latest security insights delivered directly to your inbox every week.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
            <span className="newsletter-note">Join 50,000+ security professionals</span>
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
                    <linearGradient id="footerLogoGradBlog" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#f87171" />
                    </linearGradient>
                  </defs>
                  <path d="M20 2L4 10v12c0 9.94 7.16 17.9 16 20 8.84-2.1 16-10.06 16-20V10L20 2z" fill="url(#footerLogoGradBlog)" opacity="0.15" />
                  <path d="M20 4.5L7 11.5v10c0 7.95 5.77 14.32 13 16 7.23-1.68 13-8.05 13-16v-10L20 4.5z" stroke="url(#footerLogoGradBlog)" strokeWidth="2" fill="none" />
                  <path d="M20 12v12M12 16l8 4 8-4" stroke="url(#footerLogoGradBlog)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="20" cy="18" r="3" fill="url(#footerLogoGradBlog)" />
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

export default BlogPage;
