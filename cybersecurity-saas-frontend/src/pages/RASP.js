import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../services/axios";
import { logoutUser } from "../store/authActions";

function RASP() {
  const [activeTab, setActiveTab] = useState("applications");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [attacks, setAttacks] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [stats, setStats] = useState({ totalBlocked: 0, totalAllowed: 0, blockedToday: 0 });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appRes, attackRes, policyRes, statsRes] = await Promise.all([
        api.get("/rasp/applications/"),
        api.get("/rasp/events/attacks/"),
        api.get("/rasp/policies/"),
        api.get("/rasp/events/stats/"),
      ]);
      setApplications(appRes.data?.results || appRes.data || []);
      setAttacks(attackRes.data?.results || attackRes.data || []);
      setPolicies(policyRes.data?.results || policyRes.data || []);
      setStats(statsRes.data || { totalBlocked: 0, totalAllowed: 0, blockedToday: 0 });
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    dispatch(logoutUser());
    navigate("/");
  };

  const toggleProtection = async (appId, enabled) => {
    try {
      setLoading(true);
      await api.post(`/rasp/applications/${appId}/toggle/`, { enabled: !enabled });
      fetchData();
    } catch (err) {
      console.error("Error toggling protection", err);
    } finally {
      setLoading(false);
    }
  };

  const updatePolicy = async (policyId, enabled) => {
    try {
      setLoading(true);
      await api.patch(`/rasp/policies/${policyId}/`, { enabled: !enabled });
      fetchData();
    } catch (err) {
      console.error("Error updating policy", err);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: "applications", label: "Applications", icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" },
    { id: "attacks", label: "Attack Events", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
    { id: "policies", label: "Policies", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    { id: "stats", label: "Statistics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  ];

  const getSeverityColor = (severity) => {
    const colors = {
      critical: { bg: "#fef2f2", text: "#dc2626" },
      high: { bg: "#fff7ed", text: "#ea580c" },
      medium: { bg: "#fef3c7", text: "#d97706" },
      low: { bg: "#dbeafe", text: "#2563eb" },
    };
    return colors[severity?.toLowerCase()] || colors.low;
  };

  if (loading && applications.length === 0) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
        <p>Loading RASP...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <Link to="/dashboard" className="sidebar-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            <span>CyberShield</span>
          </Link>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="sidebar-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span>Dashboard</span>
          </Link>
          {menuItems.map((item) => (
            <button key={item.id} className={`sidebar-link ${activeTab === item.id ? "active" : ""}`} onClick={() => setActiveTab(item.id)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={item.icon} /></svg>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div>
              <h1>Runtime Application Security</h1>
              <p>Real-time application protection</p>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {activeTab === "applications" && (
            <div className="tab-panel">
              <div className="card full-width">
                <div className="card-header">
                  <h3>Protected Applications</h3>
                </div>
                <div className="card-body">
                  {applications.length === 0 ? (
                    <div className="empty-state">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                      <p>No applications monitored</p>
                    </div>
                  ) : (
                    <div className="incidents-grid">
                      {applications.map((app) => (
                        <div key={app.id} className="incident-card">
                          <div className="incident-card-header">
                            <h3>{app.name}</h3>
                            <span className={`badge ${app.protection_enabled ? "badge-success" : "badge-danger"}`}>
                              {app.protection_enabled ? "Protected" : "Unprotected"}
                            </span>
                          </div>
                          <div className="incident-card-body">
                            <p>Environment: {app.environment}</p>
                            <p>Language: {app.language}</p>
                            <p>Blocked Attacks: {app.blocked_count || 0}</p>
                            <button className={`btn btn-sm ${app.protection_enabled ? "btn-danger" : "btn-success"}`} onClick={() => toggleProtection(app.id, app.protection_enabled)} disabled={loading}>
                              {app.protection_enabled ? "Disable Protection" : "Enable Protection"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "attacks" && (
            <div className="tab-panel">
              <div className="card full-width">
                <div className="card-header">
                  <h3>Real-Time Attack Events</h3>
                </div>
                <div className="card-body">
                  {attacks.length === 0 ? (
                    <div className="empty-state success">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <p>No attacks detected</p>
                      <span>Your applications are secure</span>
                    </div>
                  ) : (
                    <div className="table-container">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Application</th>
                            <th>Attack Type</th>
                            <th>Severity</th>
                            <th>Blocked</th>
                            <th>Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attacks.map((attack) => {
                            const colors = getSeverityColor(attack.severity);
                            return (
                              <tr key={attack.id}>
                                <td>{attack.application_name}</td>
                                <td>{attack.attack_type}</td>
                                <td><span className="badge" style={{ background: colors.bg, color: colors.text }}>{attack.severity}</span></td>
                                <td><span className={`badge ${attack.blocked ? "badge-success" : "badge-warning"}`}>{attack.blocked ? "Blocked" : "Allowed"}</span></td>
                                <td>{attack.timestamp ? new Date(attack.timestamp).toLocaleString() : "N/A"}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "policies" && (
            <div className="tab-panel">
              <div className="card full-width">
                <div className="card-header">
                  <h3>Protection Policies</h3>
                </div>
                <div className="card-body">
                  {policies.length === 0 ? (
                    <div className="empty-state">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      <p>No policies configured</p>
                    </div>
                  ) : (
                    <div className="incidents-grid">
                      {policies.map((policy) => (
                        <div key={policy.id} className="incident-card">
                          <div className="incident-card-header">
                            <h3>{policy.name}</h3>
                            <label className="switch">
                              <input type="checkbox" checked={policy.enabled} onChange={() => updatePolicy(policy.id, policy.enabled)} />
                              <span className="slider"></span>
                            </label>
                          </div>
                          <div className="incident-card-body">
                            <p>Type: {policy.policy_type}</p>
                            <p>Action: {policy.action}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="tab-panel">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: "#fef2f2" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <div className="stat-content">
                    <h3>{stats.totalBlocked}</h3>
                    <p>Total Blocked</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: "#dbeafe" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div className="stat-content">
                    <h3>{stats.totalAllowed}</h3>
                    <p>Total Allowed</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: "#fef3c7" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div className="stat-content">
                    <h3>{stats.blockedToday}</h3>
                    <p>Blocked Today</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default RASP;
