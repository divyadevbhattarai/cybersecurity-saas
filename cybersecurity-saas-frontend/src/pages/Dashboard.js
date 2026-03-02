import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import api from "../services/axios";
import WebSocketComponent from "../components/WebSocketComponent";
import { logoutUser } from "../store/authActions";

function Dashboard() {
  const [breaches, setBreaches] = useState([]);
  const [auditResults, setAuditResults] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auditLoading, setAuditLoading] = useState(false);
  const [threatLoading, setThreatLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [breachesRes] = await Promise.all([api.get("/breaches/")]);
      setBreaches(breachesRes.data);
    } catch (err) {
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const runCloudAudit = async () => {
    setAuditLoading(true);
    try {
      const response = await api.get("/cloud-audits/audit/");
      setAuditResults(response.data);
    } catch (err) {
      setError("Failed to run cloud audit. Please try again.");
    } finally {
      setAuditLoading(false);
    }
  };

  const runThreatDetection = async () => {
    setThreatLoading(true);
    try {
      const response = await api.get("/ml-model/threat-detection/");
      setAnomalies(response.data.anomalies || []);
    } catch (err) {
      setError("Failed to run threat detection. Please try again.");
    } finally {
      setThreatLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expiry");
    dispatch(logoutUser());
    navigate("/");
  };

  const getStatusColor = (status) => {
    if (status === "open" || status === "critical") return { bg: "#fef2f2", text: "#dc2626" };
    if (status === "closed" || status === "resolved") return { bg: "#dcfce7", text: "#16a34a" };
    return { bg: "#fef3c7", text: "#d97706" };
  };

  const stats = {
    totalBreaches: breaches.length,
    openBreaches: breaches.filter((b) => b.status === "open").length,
    closedBreaches: breaches.filter((b) => b.status === "closed").length,
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", path: "/dashboard" },
    { id: "incidents", label: "Incidents", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01", path: "/incidents" },
    { id: "audits", label: "Cloud Audits", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", path: null },
    { id: "threats", label: "Threat Detection", icon: "M13 10V3L4 14h7v7l9-11h-7z", path: null },
    { id: "alerts", label: "Real-Time Alerts", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", path: null },
    { id: "ztna", label: "ZTNA", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", path: "/ztna" },
    { id: "soar", label: "SOAR", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z", path: "/soar" },
    { id: "sbom", label: "SBOM", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01", path: "/sbom" },
    { id: "rasp", label: "RASP", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4", path: "/rasp" },
    { id: "deception", label: "Deception", icon: "M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z", path: "/deception" },
    { id: "audit", label: "Audit", icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", path: "/audit" },
    { id: "compliance", label: "Compliance", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", path: "/compliance" },
    { id: "quantum", label: "Quantum Crypto", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z", path: "/quantum-crypto" },
    { id: "confidential", label: "Confidential", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", path: "/confidential-computing" },
    { id: "privacy", label: "Privacy ML", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", path: "/privacy-ml" },
    { id: "training", label: "Training", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", path: "/training" },
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
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
            item.path ? (
              <Link
                key={item.id}
                to={item.path}
                className={`sidebar-link ${activeTab === item.id ? "active" : ""}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon} />
                </svg>
                <span>{item.label}</span>
              </Link>
            ) : (
              <button
                key={item.id}
                className={`sidebar-link ${activeTab === item.id ? "active" : ""}`}
                onClick={() => setActiveTab(item.id)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon} />
                </svg>
                <span>{item.label}</span>
              </button>
            )
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
              <h1>Security Dashboard</h1>
              <p>Monitor your cloud infrastructure security</p>
            </div>
          </div>
          <div className="header-right">
            <div className="status-indicator online">
              <span className="status-dot"></span>
              System Online
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {error && <div className="alert alert-error">{error}</div>}

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="tab-panel">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: "#eef2ff" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2">
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <h3>{stats.totalBreaches}</h3>
                    <p>Total Incidents</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: "#fef2f2" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                      <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <h3>{stats.openBreaches}</h3>
                    <p>Open Issues</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: "#dcfce7" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <h3>{stats.closedBreaches}</h3>
                    <p>Resolved</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: "#fef3c7" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                      <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <h3>{stats.totalBreaches > 0 ? Math.round((stats.closedBreaches / stats.totalBreaches) * 100) : 100}%</h3>
                    <p>Resolution Rate</p>
                  </div>
                </div>
              </div>

              <div className="dashboard-grid">
                <div className="card">
                  <div className="card-header">
                    <h3>Recent Incidents</h3>
                    <Link to="/incidents" className="card-link">View All</Link>
                  </div>
                  <div className="card-body">
                    {breaches.length === 0 ? (
                      <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <p>No incidents found</p>
                        <span>Your system is secure</span>
                      </div>
                    ) : (
                      <div className="incident-list">
                        {breaches.slice(0, 5).map((breach) => {
                          const colors = getStatusColor(breach.status);
                          return (
                            <div key={breach.id} className="incident-item">
                              <div className="incident-info">
                                <span className="incident-name">{breach.name}</span>
                                <span className="incident-date">{new Date(breach.created_at || Date.now()).toLocaleDateString()}</span>
                              </div>
                              <span className="incident-status" style={{ background: colors.bg, color: colors.text }}>
                                {breach.status}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3>Quick Actions</h3>
                  </div>
                  <div className="card-body">
                    <div className="action-buttons">
                      <button className="action-btn" onClick={runCloudAudit} disabled={auditLoading}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        {auditLoading ? "Running..." : "Run Cloud Audit"}
                      </button>
                      <button className="action-btn" onClick={runThreatDetection} disabled={threatLoading}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {threatLoading ? "Analyzing..." : "Detect Threats"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cloud Audits Tab */}
          {activeTab === "audits" && (
            <div className="tab-panel">
              <div className="card full-width">
                <div className="card-header">
                  <h3>Cloud Security Audits</h3>
                  <button className="btn btn-primary" onClick={runCloudAudit} disabled={auditLoading}>
                    {auditLoading ? "Running Audit..." : "Run New Audit"}
                  </button>
                </div>
                <div className="card-body">
                  <p className="card-description">
                    Check your AWS infrastructure for security vulnerabilities including S3 buckets, IAM roles, KMS encryption, and CloudTrail logging.
                  </p>
                  {auditResults ? (
                    <div className="audit-result success">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <div>
                        <h4>Audit Completed Successfully</h4>
                        <p>{auditResults.message || "Your cloud infrastructure has been scanned. All security checks passed."}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <p>No audit results yet</p>
                      <span>Run an audit to see results</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Threat Detection Tab */}
          {activeTab === "threats" && (
            <div className="tab-panel">
              <div className="card full-width">
                <div className="card-header">
                  <h3>AI Threat Detection</h3>
                  <button className="btn btn-primary" onClick={runThreatDetection} disabled={threatLoading}>
                    {threatLoading ? "Analyzing..." : "Run Detection"}
                  </button>
                </div>
                <div className="card-body">
                  <p className="card-description">
                    Uses Isolation Forest machine learning algorithm to detect anomalies in user behavior, login patterns, and suspicious activities.
                  </p>
                  {anomalies.length > 0 ? (
                    <div className="anomalies-list">
                      {anomalies.map((anomaly, index) => (
                        <div key={index} className="anomaly-card">
                          <div className="anomaly-header">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>Anomaly Detected</span>
                          </div>
                          <pre>{JSON.stringify(anomaly, null, 2)}</pre>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state success">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5">
                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <p>No anomalies detected</p>
                      <span>Your system appears secure</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Real-Time Alerts Tab */}
          {activeTab === "alerts" && (
            <div className="tab-panel">
              <div className="card full-width">
                <div className="card-header">
                  <h3>Real-Time Threat Alerts</h3>
                </div>
                <div className="card-body">
                  <p className="card-description">
                    Receive instant notifications when security threats are detected. This feature uses WebSocket for real-time communication.
                  </p>
                  <WebSocketComponent />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
