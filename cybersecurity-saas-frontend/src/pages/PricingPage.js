import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import "../index.css";

function PricingPage() {
  const [billingCycle, setBillingCycle] = useState("annual");

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small teams getting started with security",
      price: { monthly: 499, annual: 399 },
      features: [
        "Up to 10 users",
        "5 AWS accounts",
        "Basic threat detection",
        "Email support",
        "Weekly reports",
        "99.5% uptime SLA"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Professional",
      description: "Advanced security for growing organizations",
      price: { monthly: 999, annual: 799 },
      features: [
        "Up to 50 users",
        "25 cloud accounts",
        "AI-powered threat detection",
        "24/7 priority support",
        "Real-time alerts",
        "Custom integrations",
        "Compliance reports",
        "99.9% uptime SLA"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      description: "Full-scale security for large organizations",
      price: { monthly: 2499, annual: 1999 },
      features: [
        "Unlimited users",
        "Unlimited cloud accounts",
        "Advanced AI threat detection",
        "Dedicated support engineer",
        "Custom SLA",
        "On-premise deployment",
        "Advanced compliance",
        "White-glove onboarding",
        "99.99% uptime SLA"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const addons = [
    { name: "Additional Cloud Accounts", price: 25, description: "Per account per month" },
    { name: "Extended Log Retention", price: 100, description: "Additional 90 days" },
    { name: "Dedicated Support Engineer", price: 500, description: "Per month" },
    { name: "Custom Integrations", price: 250, description: "Per integration" },
  ];

  const faqs = [
    { question: "How does the free trial work?", answer: "Start with a 14-day free trial of our Professional plan. No credit card required. You get full access to all features during the trial period." },
    { question: "Can I change plans later?", answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, with prorated billing." },
    { question: "What payment methods do you accept?", answer: "We accept all major credit cards, ACH transfers, and wire transfers for Enterprise plans." },
    { question: "Is there a long-term contract?", answer: "No, all plans are month-to-month or annual. Save 20% with annual billing." },
    { question: "What happens if I exceed my plan limits?", answer: "We'll notify you when you're approaching limits. You can upgrade or pay for overages at the same per-unit rate." },
  ];

  const comparison = [
    { feature: "Users", starter: "10", professional: "50", enterprise: "Unlimited" },
    { feature: "Cloud Accounts", starter: "5", professional: "25", enterprise: "Unlimited" },
    { feature: "Threat Detection", starter: "Basic", professional: "AI-Powered", enterprise: "Advanced AI" },
    { feature: "Support", starter: "Email", professional: "24/7 Priority", enterprise: "Dedicated Engineer" },
    { feature: "Compliance Reports", starter: false, professional: true, enterprise: true },
    { feature: "Custom Integrations", starter: false, professional: true, enterprise: true },
    { feature: "On-Premise Deployment", starter: false, professional: false, enterprise: true },
    { feature: "Uptime SLA", starter: "99.5%", professional: "99.9%", enterprise: "99.99%" },
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
              Pricing
            </span>
          </div>
          <h1 className="product-hero-title">Simple, Transparent Pricing</h1>
          <p className="product-hero-subtitle">
            Choose the plan that fits your organization's needs. All plans include a 14-day free trial.
          </p>
          <div className="billing-toggle">
            <button 
              className={billingCycle === "monthly" ? "active" : ""}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </button>
            <button 
              className={billingCycle === "annual" ? "active" : ""}
              onClick={() => setBillingCycle("annual")}
            >
              Annual
              <span className="save-badge">Save 20%</span>
            </button>
          </div>
        </div>
      </section>

      <section className="product-section">
        <div className="section-background">
          <div className="bg-gradient"></div>
        </div>
        <div className="product-section-container">
          <div className="pricing-grid">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`pricing-card ${plan.popular ? "popular" : ""}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {plan.popular && <span className="popular-badge">Most Popular</span>}
                <h3>{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>
                <div className="plan-price">
                  <span className="currency">$</span>
                  <span className="amount">{billingCycle === "annual" ? plan.price.annual : plan.price.monthly}</span>
                  <span className="period">/month</span>
                </div>
                <ul className="plan-features">
                  {plan.features.map((feature, i) => (
                    <li key={i}>
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`btn ${plan.popular ? "btn-primary" : "btn-outline"} btn-lg`}>
                  {plan.cta}
                </button>
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
            <span className="section-label">Add-ons</span>
            <h2>Customize Your Plan</h2>
          </div>
          <div className="addons-grid">
            {addons.map((addon, index) => (
              <div key={index} className="addon-card">
                <div className="addon-info">
                  <h3>{addon.name}</h3>
                  <p>{addon.description}</p>
                </div>
                <div className="addon-price">
                  <span className="price">${addon.price}</span>
                  <span className="period">/mo</span>
                </div>
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
            <span className="section-label">Compare</span>
            <h2>Feature Comparison</h2>
          </div>
          <div className="comparison-table">
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Starter</th>
                  <th>Professional</th>
                  <th>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, index) => (
                  <tr key={index}>
                    <td>{row.feature}</td>
                    <td>{typeof row.starter === "boolean" ? (row.starter ? "✓" : "—") : row.starter}</td>
                    <td>{typeof row.professional === "boolean" ? (row.professional ? "✓" : "—") : row.professional}</td>
                    <td>{typeof row.enterprise === "boolean" ? (row.enterprise ? "✓" : "—") : row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="product-section">
        <div className="section-background">
          <div className="bg-grid"></div>
        </div>
        <div className="product-section-container">
          <div className="section-intro">
            <span className="section-label">FAQ</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
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
            <h2>Ready to Get Started?</h2>
            <p>Start your free 14-day trial today. No credit card required.</p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-lg">Start Free Trial</Link>
              <Link to="/contact" className="btn btn-outline btn-lg">Talk to Sales</Link>
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
                    <linearGradient id="footerLogoGradPricing" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#f87171" />
                    </linearGradient>
                  </defs>
                  <path d="M20 2L4 10v12c0 9.94 7.16 17.9 16 20 8.84-2.1 16-10.06 16-20V10L20 2z" fill="url(#footerLogoGradPricing)" opacity="0.15" />
                  <path d="M20 4.5L7 11.5v10c0 7.95 5.77 14.32 13 16 7.23-1.68 13-8.05 13-16v-10L20 4.5z" stroke="url(#footerLogoGradPricing)" strokeWidth="2" fill="none" />
                  <path d="M20 12v12M12 16l8 4 8-4" stroke="url(#footerLogoGradPricing)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="20" cy="18" r="3" fill="url(#footerLogoGradPricing)" />
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

export default PricingPage;
