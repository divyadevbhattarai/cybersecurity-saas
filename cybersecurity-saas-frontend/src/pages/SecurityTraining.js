import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/authActions";
import api from "../services/axios";

function SecurityTraining() {
  const [activeModule, setActiveModule] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("training");
  const [completedModules, setCompletedModules] = useState([1, 2]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const modules = [
    {
      id: 1,
      title: "Password Security",
      description: "Learn how to create and manage secure passwords",
      duration: "15 min",
      level: "Beginner",
      icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z",
      content: [
        "Use at least 12 characters with a mix of letters, numbers, and symbols",
        "Never reuse passwords across different accounts",
        "Use a password manager to store your passwords securely",
        "Enable two-factor authentication whenever possible",
        "Never share your password via email or phone",
      ],
    },
    {
      id: 2,
      title: "Phishing Awareness",
      description: "Recognize and avoid phishing attacks",
      duration: "20 min",
      level: "Intermediate",
      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      content: [
        "Check sender email addresses carefully for misspellings",
        "Hover over links before clicking to see the actual URL",
        "Be wary of urgent requests for personal information",
        "Verify requests through official channels",
        "Report suspicious emails to your IT security team",
      ],
    },
    {
      id: 3,
      title: "Social Engineering",
      description: "Understanding manipulation tactics used by attackers",
      duration: "25 min",
      level: "Intermediate",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      content: [
        "Be cautious of unsolicited phone calls asking for sensitive info",
        "Verify the identity of people requesting access",
        "Don't let urgency override your security judgment",
        "Follow proper verification procedures",
        "Report suspicious requests to security team",
      ],
    },
    {
      id: 4,
      title: "Data Protection",
      description: "How to handle and protect sensitive data",
      duration: "20 min",
      level: "Advanced",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      content: [
        "Classify data according to sensitivity levels",
        "Encrypt sensitive files before sharing",
        "Use secure file transfer protocols",
        "Follow data retention policies",
        "Properly dispose of sensitive data",
      ],
    },
    {
      id: 5,
      title: "Secure Browsing",
      description: "Best practices for safe internet usage",
      duration: "15 min",
      level: "Beginner",
      icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
      content: [
        "Always check for HTTPS in website URLs",
        "Keep your browser and plugins updated",
        "Use ad-blockers and script blockers",
        "Avoid public WiFi for sensitive transactions",
        "Clear browser cache regularly",
      ],
    },
    {
      id: 6,
      title: "Incident Response",
      description: "What to do when a security incident occurs",
      duration: "30 min",
      level: "Advanced",
      icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
      content: [
        "Know how to report security incidents",
        "Don't try to fix it yourself - call the experts",
        "Document everything you observe",
        "Preserve evidence for investigation",
        "Follow your organization's incident response plan",
      ],
    },
  ];

  const handleLogout = async () => {
    try {
      await api.post("/users/logout/");
    } catch (err) {
      console.error("Logout error:", err);
    }
    dispatch(logoutUser());
    navigate("/");
  };

  const toggleModule = (id) => {
    setActiveModule(activeModule === id ? null : id);
  };

  const markComplete = (id) => {
    if (!completedModules.includes(id)) {
      setCompletedModules([...completedModules, id]);
    }
    setActiveModule(null);
  };

  const getLevelBadge = (level) => {
    const classes = {
      Beginner: "badge-success",
      Intermediate: "badge-warning",
      Advanced: "badge-danger",
    };
    return classes[level] || "badge-success";
  };

  const totalMinutes = modules.reduce((acc, m) => acc + parseInt(m.duration), 0);

  const menuItems = [
    { id: "overview", label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", path: "/dashboard" },
    { id: "incidents", label: "Incidents", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", path: "/incidents" },
    { id: "training", label: "Training", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", path: "/training" },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`Sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>CyberShield</span>
          </Link>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`sidebar-link ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.username?.charAt(0).toUpperCase() || "U"}</div>
            <div className="user-details">
              <span className="user-name">{user?.username || "User"}</span>
              <span className="user-role">{user?.role || "User"}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1>Security Training</h1>
              <p>Complete security awareness training modules</p>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "#eef2ff" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2">
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="stat-content">
                <h3>{modules.length}</h3>
                <p>Total Modules</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "#dcfce7" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-content">
                <h3>{completedModules.length}</h3>
                <p>Completed</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "#fef3c7" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-content">
                <h3>{totalMinutes}</h3>
                <p>Minutes of Training</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-section">
            <div className="progress-header">
              <span>Your Progress</span>
              <span className="progress-percentage">{Math.round((completedModules.length / modules.length) * 100)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(completedModules.length / modules.length) * 100}%` }}></div>
            </div>
          </div>

          {/* Training Modules */}
          <div className="modules-container">
            <div className="modules-grid">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className={`training-card ${activeModule === module.id ? "active" : ""} ${completedModules.includes(module.id) ? "completed" : ""}`}
                >
                  <div className="training-card-header" onClick={() => toggleModule(module.id)}>
                    <div className="training-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={module.icon} />
                      </svg>
                    </div>
                    <div className="training-info">
                      <h3>{module.title}</h3>
                      <p>{module.description}</p>
                    </div>
                    <div className="training-meta">
                      <span className={`badge ${getLevelBadge(module.level)}`}>{module.level}</span>
                      <span className="duration">{module.duration}</span>
                      {completedModules.includes(module.id) && (
                        <span className="completed-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>

                  {activeModule === module.id && (
                    <div className="training-card-body">
                      <h4>Key Points:</h4>
                      <ul className="key-points">
                        {module.content.map((point, index) => (
                          <li key={index}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                            {point}
                          </li>
                        ))}
                      </ul>
                      {!completedModules.includes(module.id) && (
                        <button className="btn btn-primary" onClick={() => markComplete(module.id)}>
                          Mark as Complete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SecurityTraining;
