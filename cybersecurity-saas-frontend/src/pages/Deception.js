import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../services/axios";
import { logoutUser } from "../store/authActions";

function Deception() {
  const [activeTab, setActiveTab] = useState("honeypots");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [honeypots, setHoneypots] = useState([]);
  const [canaryTokens, setCanaryTokens] = useState([]);
  const [threatHunts, setThreatHunts] = useState([]);
  const [showCreateHoneypot, setShowCreateHoneypot] = useState(false);
  const [showCreateToken, setShowCreateToken] = useState(false);
  const [newHoneypot, setNewHoneypot] = useState({ name: "", type: "http", port: 8080 });
  const [newToken, setNewToken] = useState({ name: "", type: "file", alert_email: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [honeypotRes, tokenRes, huntRes] = await Promise.all([
        api.get("/deception/honeypots/"),
        api.get("/deception/canary-tokens/"),
        api.get("/deception/threat-hunts/"),
      ]);
      setHoneypots(honeypotRes.data || []);
      setCanaryTokens(tokenRes.data || []);
      setThreatHunts(huntRes.data || []);
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

  const createHoneypot = async (e) => {
    e.preventDefault();
    try {
      await api.post("/deception/honeypots/", newHoneypot);
      setShowCreateHoneypot(false);
      setNewHoneypot({ name: "", type: "http", port: 8080 });
      fetchData();
    } catch (err) {
      setError("Failed to create honeypot");
    }
  };

  const createCanaryToken = async (e) => {
    e.preventDefault();
    try {
      await api.post("/deception/canary-tokens/", newToken);
      setShowCreateToken(false);
      setNewToken({ name: "", type: "file", alert_email: "" });
      fetchData();
    } catch (err) {
      setError("Failed to create token");
    }
  };

  const toggleHoneypot = async (honeypotId, enabled) => {
    try {
      setLoading(true);
      await api.post(`/deception/honeypots/${honeypotId}/toggle/`, { enabled: !enabled });
      fetchData();
    } catch (err) {
      console.error("Error toggling honeypot", err);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: "honeypots", label: "Honeypots", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
    { id: "canary", label: "Canary Tokens", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
    { id: "hunts", label: "Threat Hunts", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
  ];

  const getStatusBadge = (status) => {
    const colors = {
      active: { bg: "#dcfce7", text: "#16a34a" },
      inactive: { bg: "#f3f4f6", text: "#6b7280" },
      triggered: { bg: "#fef2f2", text: "#dc2626" },
      running: { bg: "#dbeafe", text: "#2563eb" },
      completed: { bg: "#dcfce7", text: "#16a34a" },
    };
    const c = colors[status] || colors.inactive;
    return <span className="badge" style={{ background: c.bg, color: c.text }}>{status}</span>;
  };

  if (loading && honeypots.length === 0) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
        <p>Loading Deception...</p>
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
              <h1>Deceptive Security</h1>
              <p>Honeypots and canary tokens</p>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {error && <div className="alert alert-error">{error}</div>}

          {activeTab === "honeypots" && (
            <div className="tab-panel">
              <div className="card full-width">
                <div className="card-header">
                  <h3>Honeypot Management</h3>
                  <button className="btn btn-primary" onClick={() => setShowCreateHoneypot(true)}>Create Honeypot</button>
                </div>
                <div className="card-body">
                  {honeypots.length === 0 ? (
                    <div className="empty-state">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      <p>No honeypots configured</p>
                      <span>Create a honeypot to detect intruders</span>
                    </div>
                  ) : (
                    <div className="incidents-grid">
                      {honeypots.map((honeypot) => (
                        <div key={honeypot.id} className="incident-card">
                          <div className="incident-card-header">
                            <h3>{honeypot.name}</h3>
                            {getStatusBadge(honeypot.enabled ? "active" : "inactive")}
                          </div>
                          <div className="incident-card-body">
                            <p>Type: {honeypot.type}</p>
                            <p>Port: {honeypot.port}</p>
                            <p>Triggered: {honeypot.trigger_count || 0} times</p>
                            <button className={`btn btn-sm ${honeypot.enabled ? "btn-danger" : "btn-success"}`} onClick={() => toggleHoneypot(honeypot.id, honeypot.enabled)} disabled={loading}>
                              {honeypot.enabled ? "Disable" : "Enable"}
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

          {activeTab === "canary" && (
            <div className="tab-panel">
              <div className="card full-width">
                <div className="card-header">
                  <h3>Canary Tokens</h3>
                  <button className="btn btn-primary" onClick={() => setShowCreateToken(true)}>Create Token</button>
                </div>
                <div className="card-body">
                  {canaryTokens.length === 0 ? (
                    <div className="empty-state">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                      <p>No canary tokens</p>
                      <span>Create a token to detect unauthorized access</span>
                    </div>
                  ) : (
                    <div className="incidents-grid">
                      {canaryTokens.map((token) => (
                        <div key={token.id} className="incident-card">
                          <div className="incident-card-header">
                            <h3>{token.name}</h3>
                            {getStatusBadge(token.triggered ? "triggered" : "active")}
                          </div>
                          <div className="incident-card-body">
                            <p>Type: {token.type}</p>
                            <p>Created: {token.created_at ? new Date(token.created_at).toLocaleDateString() : "N/A"}</p>
                            {token.triggered && token.triggered_at && (
                              <p style={{ color: "#dc2626" }}>Triggered: {new Date(token.triggered_at).toLocaleString()}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "hunts" && (
            <div className="tab-panel">
              <div className="card full-width">
                <div className="card-header">
                  <h3>Threat Hunt Status</h3>
                </div>
                <div className="card-body">
                  {threatHunts.length === 0 ? (
                    <div className="empty-state">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      <p>No active threat hunts</p>
                    </div>
                  ) : (
                    <div className="table-container">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Findings</th>
                            <th>Started</th>
                            <th>Completed</th>
                          </tr>
                        </thead>
                        <tbody>
                          {threatHunts.map((hunt) => (
                            <tr key={hunt.id}>
                              <td>{hunt.name}</td>
                              <td>{getStatusBadge(hunt.status)}</td>
                              <td>{hunt.findings_count || 0}</td>
                              <td>{hunt.started_at ? new Date(hunt.started_at).toLocaleString() : "-"}</td>
                              <td>{hunt.completed_at ? new Date(hunt.completed_at).toLocaleString() : "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {showCreateHoneypot && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>Create Honeypot</h3>
                  <button onClick={() => setShowCreateHoneypot(false)}>&times;</button>
                </div>
                <form onSubmit={createHoneypot}>
                  <div className="form-group">
                    <label>Name</label>
                    <input type="text" value={newHoneypot.name} onChange={(e) => setNewHoneypot({ ...newHoneypot, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <select value={newHoneypot.type} onChange={(e) => setNewHoneypot({ ...newHoneypot, type: e.target.value })}>
                      <option value="http">HTTP</option>
                      <option value="ssh">SSH</option>
                      <option value="ftp">FTP</option>
                      <option value="database">Database</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Port</label>
                    <input type="number" value={newHoneypot.port} onChange={(e) => setNewHoneypot({ ...newHoneypot, port: parseInt(e.target.value) })} required />
                  </div>
                  <button type="submit" className="btn btn-primary">Create</button>
                </form>
              </div>
            </div>
          )}

          {showCreateToken && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>Create Canary Token</h3>
                  <button onClick={() => setShowCreateToken(false)}>&times;</button>
                </div>
                <form onSubmit={createCanaryToken}>
                  <div className="form-group">
                    <label>Name</label>
                    <input type="text" value={newToken.name} onChange={(e) => setNewToken({ ...newToken, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <select value={newToken.type} onChange={(e) => setNewToken({ ...newToken, type: e.target.value })}>
                      <option value="file">File</option>
                      <option value="url">URL</option>
                      <option value="email">Email</option>
                      <option value="dns">DNS</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Alert Email</label>
                    <input type="email" value={newToken.alert_email} onChange={(e) => setNewToken({ ...newToken, alert_email: e.target.value })} required />
                  </div>
                  <button type="submit" className="btn btn-primary">Create</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Deception;
