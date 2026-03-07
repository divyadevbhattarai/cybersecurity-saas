import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../services/axios";
import { logoutUser } from "../store/authActions";

function ConfidentialComputing() {
  const [activeTab, setActiveTab] = useState("enclaves");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [enclaves, setEnclaves] = useState([]);
  const [sessions, setSessions] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [enclaveRes, sessionRes] = await Promise.all([
        api.get("/confidential-computing/enclaves/"),
        api.get("/confidential-computing/sessions/"),
      ]);
      setEnclaves(enclaveRes.data || []);
      setSessions(sessionRes.data || []);
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/users/logout/");
    } catch (err) {
      console.error("Logout error:", err);
    }
    dispatch(logoutUser());
    navigate("/");
  };

  const toggleEnclave = async (enclaveId, enabled) => {
    try {
      setLoading(true);
      await api.post(`/confidential-computing/enclaves/${enclaveId}/toggle/`, { enabled: !enabled });
      fetchData();
    } catch (err) {
      console.error("Error toggling enclave", err);
    } finally {
      setLoading(false);
    }
  };

  const terminateSession = async (sessionId) => {
    try {
      setLoading(true);
      await api.post(`/confidential-computing/sessions/${sessionId}/terminate/`);
      fetchData();
    } catch (err) {
      console.error("Error terminating session", err);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: "enclaves", label: "Enclave Management", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
    { id: "sessions", label: "Secure Sessions", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  ];

  const getStatusBadge = (status) => {
    const colors = {
      running: { bg: "#dcfce7", text: "#16a34a" },
      stopped: { bg: "#f3f4f6", text: "#6b7280" },
      active: { bg: "#dbeafe", text: "#2563eb" },
      terminated: { bg: "#fef2f2", text: "#dc2626" },
    };
    const c = colors[status] || colors.stopped;
    return <span className="badge" style={{ background: c.bg, color: c.text }}>{status}</span>;
  };

  if (loading && enclaves.length === 0) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
        <p>Loading Confidential Computing...</p>
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
              <h1>Confidential Computing</h1>
              <p>Hardware-based trusted execution environments</p>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {activeTab === "enclaves" && (
            <div className="tab-panel">
              <div className="card full-width">
                <div className="card-header">
                  <h3>Secure Enclaves</h3>
                </div>
                <div className="card-body">
                  {enclaves.length === 0 ? (
                    <div className="empty-state">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      <p>No enclaves configured</p>
                      <span>Create an enclave to protect sensitive workloads</span>
                    </div>
                  ) : (
                    <div className="incidents-grid">
                      {enclaves.map((enclave) => (
                        <div key={enclave.id} className="incident-card">
                          <div className="incident-card-header">
                            <h3>{enclave.name}</h3>
                            {getStatusBadge(enclave.status)}
                          </div>
                          <div className="incident-card-body">
                            <p>Type: {enclave.enclave_type}</p>
                            <p>CPU: {enclave.cpu_cores} cores</p>
                            <p>Memory: {enclave.memory_mb} MB</p>
                            <p>Created: {enclave.created_at ? new Date(enclave.created_at).toLocaleDateString() : "N/A"}</p>
                            <button className={`btn btn-sm ${enclave.status === "running" ? "btn-danger" : "btn-success"}`} onClick={() => toggleEnclave(enclave.id, enclave.status === "running")} disabled={loading}>
                              {enclave.status === "running" ? "Stop" : "Start"}
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

          {activeTab === "sessions" && (
            <div className="tab-panel">
              <div className="card full-width">
                <div className="card-header">
                  <h3>Secure Sessions</h3>
                </div>
                <div className="card-body">
                  {sessions.length === 0 ? (
                    <div className="empty-state">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      <p>No active sessions</p>
                    </div>
                  ) : (
                    <div className="table-container">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Session ID</th>
                            <th>Enclave</th>
                            <th>User</th>
                            <th>Status</th>
                            <th>Started</th>
                            <th>Last Activity</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sessions.map((session) => (
                            <tr key={session.id}>
                              <td>{session.id.substring(0, 8)}...</td>
                              <td>{session.enclave_name}</td>
                              <td>{session.user}</td>
                              <td>{getStatusBadge(session.status)}</td>
                              <td>{session.started_at ? new Date(session.started_at).toLocaleString() : "N/A"}</td>
                              <td>{session.last_activity ? new Date(session.last_activity).toLocaleString() : "N/A"}</td>
                              <td>
                                <button className="btn btn-sm btn-danger" onClick={() => terminateSession(session.id)} disabled={loading}>
                                  Terminate
                                </button>
                              </td>
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
        </div>
      </main>
    </div>
  );
}

export default ConfidentialComputing;
