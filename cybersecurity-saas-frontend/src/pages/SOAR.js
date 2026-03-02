import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../services/axios";
import { logoutUser } from "../store/authActions";

function SOAR() {
  const [activeTab, setActiveTab] = useState("playbooks");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playbooks, setPlaybooks] = useState([]);
  const [agents, setAgents] = useState([]);
  const [history, setHistory] = useState([]);
  const [webhooks, setWebhooks] = useState([]);
  const [showCreatePlaybook, setShowCreatePlaybook] = useState(false);
  const [showCreateWebhook, setShowCreateWebhook] = useState(false);
  const [newPlaybook, setNewPlaybook] = useState({ name: "", description: "", trigger: "manual" });
  const [newWebhook, setNewWebhook] = useState({ name: "", url: "", events: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [playbookRes, agentRes, historyRes, webhookRes] = await Promise.all([
        api.get("/soar/playbooks/"),
        api.get("/soar/agents/"),
        api.get("/soar/runs/executions/"),
        api.get("/soar/webhooks/"),
      ]);
      setPlaybooks(playbookRes.data?.results || playbookRes.data || []);
      setAgents(agentRes.data?.results || agentRes.data || []);
      setHistory(historyRes.data?.results || historyRes.data || []);
      setWebhooks(webhookRes.data?.results || webhookRes.data || []);
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

  const runPlaybook = async (playbookId) => {
    try {
      setLoading(true);
      await api.post(`/soar/playbooks/${playbookId}/run/`);
      fetchData();
    } catch (err) {
      console.error("Error running playbook", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAgent = async (agentId, currentStatus) => {
    try {
      setLoading(true);
      const action = currentStatus === "running" ? "stop" : "start";
      await api.post(`/soar/agents/${agentId}/${action}/`);
      fetchData();
    } catch (err) {
      console.error("Error toggling agent", err);
    } finally {
      setLoading(false);
    }
  };

  const createPlaybook = async (e) => {
    e.preventDefault();
    try {
      await api.post("/soar/playbooks/", newPlaybook);
      setShowCreatePlaybook(false);
      setNewPlaybook({ name: "", description: "", trigger: "manual" });
      fetchData();
    } catch (err) {
      setError("Failed to create playbook");
    }
  };

  const createWebhook = async (e) => {
    e.preventDefault();
    try {
      await api.post("/soar/webhooks/", newWebhook);
      setShowCreateWebhook(false);
      setNewWebhook({ name: "", url: "", events: "" });
      fetchData();
    } catch (err) {
      setError("Failed to create webhook");
    }
  };

  const menuItems = [
    { id: "playbooks", label: "Playbooks", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
    { id: "agents", label: "Security Agents", icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" },
    { id: "history", label: "Execution History", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "webhooks", label: "Webhooks", icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" },
  ];

  const getStatusBadge = (status) => {
    const colors = {
      active: { bg: "#dcfce7", text: "#16a34a" },
      inactive: { bg: "#f3f4f6", text: "#6b7280" },
      running: { bg: "#dbeafe", text: "#2563eb" },
      success: { bg: "#dcfce7", text: "#16a34a" },
      failed: { bg: "#fef2f2", text: "#dc2626" },
      pending: { bg: "#fef3c7", text: "#d97706" },
    };
    const c = colors[status] || colors.inactive;
    return <span className="badge" style={{ background: c.bg, color: c.text }}>{status}</span>;
  };

  if (loading && playbooks.length === 0) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
        <p>Loading SOAR...</p>
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
              <h1>Security Orchestration</h1>
              <p>Automate security response workflows</p>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {error && <div className="alert alert-error">{error}</div>}

          {activeTab === "playbooks" && (
            <div className="tab-panel">
              <div className="card full-width">
                <div className="card-header">
                  <h3>Security Playbooks</h3>
                  <button className="btn btn-primary" onClick={() => setShowCreatePlaybook(true)}>Create Playbook</button>
                </div>
                <div className="card-body">
                  {playbooks.length === 0 ? (
                    <div className="empty-state">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                      <p>No playbooks created</p>
                      <span>Create a playbook to automate security responses</span>
                    </div>
                  ) : (
                    <div className="table-container">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Trigger</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {playbooks.map((playbook) => (
                            <tr key={playbook.id}>
                              <td>{playbook.name}</td>
                              <td>{playbook.description}</td>
                              <td>{playbook.trigger}</td>
                              <td>{getStatusBadge(playbook.status)}</td>
                              <td>
                                <button className="btn btn-sm btn-primary" onClick={() => runPlaybook(playbook.id)} disabled={loading}>
                                  Run
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

          {activeTab === "agents" && (
            <div className="tab-panel">
              <div className="card full-width">
                <div className="card-header">
                  <h3>Security Agents</h3>
                </div>
                <div className="card-body">
                  {agents.length === 0 ? (
                    <div className="empty-state">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                      <p>No security agents</p>
                    </div>
                  ) : (
                    <div className="incidents-grid">
                      {agents.map((agent) => (
                        <div key={agent.id} className="incident-card">
                          <div className="incident-card-header">
                            <h3>{agent.name}</h3>
                            {getStatusBadge(agent.status)}
                          </div>
                          <div className="incident-card-body">
                            <p>Type: {agent.agent_type}</p>
                            <p>Last Run: {agent.last_run ? new Date(agent.last_run).toLocaleDateString() : "Never"}</p>
                            <button className={`btn btn-sm ${agent.status === "running" ? "btn-danger" : "btn-success"}`} onClick={() => toggleAgent(agent.id, agent.status)} disabled={loading}>
                              {agent.status === "running" ? "Stop" : "Start"}
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

          {activeTab === "history" && (
            <div className="tab-panel">
              <div className="card full-width">
                <div className="card-header">
                  <h3>Execution History</h3>
                </div>
                <div className="card-body">
                  {history.length === 0 ? (
                    <div className="empty-state">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <p>No execution history</p>
                    </div>
                  ) : (
                    <div className="table-container">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Playbook</th>
                            <th>Executed By</th>
                            <th>Status</th>
                            <th>Started</th>
                            <th>Completed</th>
                          </tr>
                        </thead>
                        <tbody>
                          {history.map((exec) => (
                            <tr key={exec.id}>
                              <td>{exec.playbook_name}</td>
                              <td>{exec.executed_by}</td>
                              <td>{getStatusBadge(exec.status)}</td>
                              <td>{exec.started_at ? new Date(exec.started_at).toLocaleString() : "-"}</td>
                              <td>{exec.completed_at ? new Date(exec.completed_at).toLocaleString() : "-"}</td>
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

          {activeTab === "webhooks" && (
            <div className="tab-panel">
              <div className="card full-width">
                <div className="card-header">
                  <h3>Webhooks Configuration</h3>
                  <button className="btn btn-primary" onClick={() => setShowCreateWebhook(true)}>Add Webhook</button>
                </div>
                <div className="card-body">
                  {webhooks.length === 0 ? (
                    <div className="empty-state">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                      <p>No webhooks configured</p>
                    </div>
                  ) : (
                    <div className="incidents-grid">
                      {webhooks.map((webhook) => (
                        <div key={webhook.id} className="incident-card">
                          <div className="incident-card-header">
                            <h3>{webhook.name}</h3>
                            {getStatusBadge(webhook.active ? "active" : "inactive")}
                          </div>
                          <div className="incident-card-body">
                            <p>URL: {webhook.url}</p>
                            <p>Events: {webhook.events}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {showCreatePlaybook && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>Create Playbook</h3>
                  <button onClick={() => setShowCreatePlaybook(false)}>&times;</button>
                </div>
                <form onSubmit={createPlaybook}>
                  <div className="form-group">
                    <label>Name</label>
                    <input type="text" value={newPlaybook.name} onChange={(e) => setNewPlaybook({ ...newPlaybook, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea value={newPlaybook.description} onChange={(e) => setNewPlaybook({ ...newPlaybook, description: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Trigger</label>
                    <select value={newPlaybook.trigger} onChange={(e) => setNewPlaybook({ ...newPlaybook, trigger: e.target.value })}>
                      <option value="manual">Manual</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="event">Event-based</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">Create</button>
                </form>
              </div>
            </div>
          )}

          {showCreateWebhook && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>Add Webhook</h3>
                  <button onClick={() => setShowCreateWebhook(false)}>&times;</button>
                </div>
                <form onSubmit={createWebhook}>
                  <div className="form-group">
                    <label>Name</label>
                    <input type="text" value={newWebhook.name} onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>URL</label>
                    <input type="url" value={newWebhook.url} onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Events</label>
                    <input type="text" value={newWebhook.events} onChange={(e) => setNewWebhook({ ...newWebhook, events: e.target.value })} placeholder="e.g., incident.created" />
                  </div>
                  <button type="submit" className="btn btn-primary">Add</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default SOAR;
