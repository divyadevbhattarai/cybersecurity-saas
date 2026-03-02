import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../services/axios";
import { logoutUser } from "../store/authActions";

function PrivacyML() {
  const [activeTab, setActiveTab] = useState("models");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [models, setModels] = useState([]);
  const [trainingJobs, setTrainingJobs] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [newJob, setNewJob] = useState({ model_name: "", dataset: "", rounds: 10 });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [modelRes, jobRes, participantRes] = await Promise.all([
        api.get("/privacy-ml/models/"),
        api.get("/privacy-ml/training-jobs/"),
        api.get("/privacy-ml/participants/"),
      ]);
      setModels(modelRes.data || []);
      setTrainingJobs(jobRes.data || []);
      setParticipants(participantRes.data || []);
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

  const startTrainingJob = async (e) => {
    e.preventDefault();
    try {
      await api.post("/privacy-ml/training-jobs/", newJob);
      setShowCreateJob(false);
      setNewJob({ model_name: "", dataset: "", rounds: 10 });
      fetchData();
    } catch (err) {
      setError("Failed to start training job");
    }
  };

  const menuItems = [
    { id: "models", label: "Federated Models", icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" },
    { id: "jobs", label: "Training Jobs", icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "participants", label: "Participants", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  ];

  const getStatusBadge = (status) => {
    const colors = {
      completed: { bg: "#dcfce7", text: "#16a34a" },
      running: { bg: "#dbeafe", text: "#2563eb" },
      pending: { bg: "#fef3c7", text: "#d97706" },
      failed: { bg: "#fef2f2", text: "#dc2626" },
      active: { bg: "#dcfce7", text: "#16a34a" },
      inactive: { bg: "#f3f4f6", text: "#6b7280" },
    };
    const c = colors[status] || colors.pending;
    return <span className="badge" style={{ background: c.bg, color: c.text }}>{status}</span>;
  };

  if (loading && models.length === 0) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
        <p>Loading Privacy ML...</p>
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
              <h1>Privacy-Preserving ML</h1>
              <p>Federated learning with differential privacy</p>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {error && <div className="alert alert-error">{error}</div>}

          {activeTab === "models" && (
            <div className="tab-panel">
              <div className="card full-width">
                <div className="card-header">
                  <h3>Federated Models</h3>
                </div>
                <div className="card-body">
                  {models.length === 0 ? (
                    <div className="empty-state">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                      <p>No federated models</p>
                      <span>Start a training job to create a model</span>
                    </div>
                  ) : (
                    <div className="incidents-grid">
                      {models.map((model) => (
                        <div key={model.id} className="incident-card">
                          <div className="incident-card-header">
                            <h3>{model.name}</h3>
                            {getStatusBadge(model.status)}
                          </div>
                          <div className="incident-card-body">
                            <p>Algorithm: {model.algorithm}</p>
                            <p>Participants: {model.participant_count || 0}</p>
                            <p>Accuracy: {model.accuracy ? `${model.accuracy.toFixed(2)}%` : "N/A"}</p>
                            <p>Created: {model.created_at ? new Date(model.created_at).toLocaleDateString() : "N/A"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "jobs" && (
            <div className="tab-panel">
              <div className="card full-width">
                <div className="card-header">
                  <h3>Training Jobs</h3>
                  <button className="btn btn-primary" onClick={() => setShowCreateJob(true)}>Start Job</button>
                </div>
                <div className="card-body">
                  {trainingJobs.length === 0 ? (
                    <div className="empty-state">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <p>No training jobs</p>
                    </div>
                  ) : (
                    <div className="table-container">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Job ID</th>
                            <th>Model</th>
                            <th>Dataset</th>
                            <th>Rounds</th>
                            <th>Status</th>
                            <th>Started</th>
                            <th>Completed</th>
                          </tr>
                        </thead>
                        <tbody>
                          {trainingJobs.map((job) => (
                            <tr key={job.id}>
                              <td>{job.id.substring(0, 8)}...</td>
                              <td>{job.model_name}</td>
                              <td>{job.dataset}</td>
                              <td>{job.rounds}</td>
                              <td>{getStatusBadge(job.status)}</td>
                              <td>{job.started_at ? new Date(job.started_at).toLocaleString() : "-"}</td>
                              <td>{job.completed_at ? new Date(job.completed_at).toLocaleString() : "-"}</td>
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

          {activeTab === "participants" && (
            <div className="tab-panel">
              <div className="card full-width">
                <div className="card-header">
                  <h3>Participant Management</h3>
                </div>
                <div className="card-body">
                  {participants.length === 0 ? (
                    <div className="empty-state">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <p>No participants</p>
                    </div>
                  ) : (
                    <div className="incidents-grid">
                      {participants.map((participant) => (
                        <div key={participant.id} className="incident-card">
                          <div className="incident-card-header">
                            <h3>{participant.name}</h3>
                            {getStatusBadge(participant.status)}
                          </div>
                          <div className="incident-card-body">
                            <p>ID: {participant.participant_id}</p>
                            <p>Data Samples: {participant.data_samples || 0}</p>
                            <p>Contributions: {participant.contributions || 0}</p>
                            <p>Joined: {participant.joined_at ? new Date(participant.joined_at).toLocaleDateString() : "N/A"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {showCreateJob && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>Start Training Job</h3>
                  <button onClick={() => setShowCreateJob(false)}>&times;</button>
                </div>
                <form onSubmit={startTrainingJob}>
                  <div className="form-group">
                    <label>Model Name</label>
                    <input type="text" value={newJob.model_name} onChange={(e) => setNewJob({ ...newJob, model_name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Dataset</label>
                    <input type="text" value={newJob.dataset} onChange={(e) => setNewJob({ ...newJob, dataset: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Number of Rounds</label>
                    <input type="number" value={newJob.rounds} onChange={(e) => setNewJob({ ...newJob, rounds: parseInt(e.target.value) })} required />
                  </div>
                  <button type="submit" className="btn btn-primary">Start Training</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default PrivacyML;
