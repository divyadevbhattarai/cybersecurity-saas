import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../services/axios";
import { logoutUser } from "../store/authActions";
import { useToast } from "../components/Toast";
import { escapeHtml, sanitizeInput } from "../utils";

function ZTNA() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("biometric");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [biometricProfiles, setBiometricProfiles] = useState([]);
  const [web3Identity, setWeb3Identity] = useState(null);
  const [accessProfiles, setAccessProfiles] = useState([]);
  const [accessRequests, setAccessRequests] = useState([]);
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [showAddRequest, setShowAddRequest] = useState(false);
  const [newProfile, setNewProfile] = useState({ device_id: "", device_type: "laptop" });
  const [newRequest, setNewRequest] = useState({ resource: "", access_level: "medium", reason: "" });
  const verifyInProgress = useRef(false);
  const addProfileInProgress = useRef(false);
  const addRequestInProgress = useRef(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bioRes, accessRes, requestsRes] = await Promise.all([
        api.get("/ztna/biometrics/"),
        api.get("/ztna/profiles/"),
        api.get("/ztna/access-requests/"),
      ]);
      setBiometricProfiles(bioRes.data?.results || bioRes.data || []);
      setAccessProfiles(accessRes.data?.results || accessRes.data || []);
      setAccessRequests(requestsRes.data?.results || requestsRes.data || []);
    } catch (err) {
      console.error("Error fetching data", err);
      setError("Failed to load data");
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

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWeb3Identity({ address: accounts[0], connected: true });
      } catch (err) {
        setError("Failed to connect wallet");
      }
    } else {
      setError("MetaMask not installed");
    }
  };

  const verifyBiometric = async (profileId) => {
    if (verifyInProgress.current) return;
    verifyInProgress.current = true;
    try {
      setLoading(true);
      await api.post(`/ztna/biometrics/${profileId}/verify/`);
      fetchData();
    } catch (err) {
      console.error("Verification failed", err);
      toast.error("Failed to verify biometric profile");
    } finally {
      setLoading(false);
      verifyInProgress.current = false;
    }
  };

  const addBiometricProfile = async (e) => {
    e.preventDefault();
    if (addProfileInProgress.current) return;
    addProfileInProgress.current = true;
    const sanitizedProfile = {
      device_id: sanitizeInput(newProfile.device_id),
      device_type: newProfile.device_type
    };
    try {
      await api.post("/ztna/biometrics/", sanitizedProfile);
      setShowAddProfile(false);
      setNewProfile({ device_id: "", device_type: "laptop" });
      fetchData();
      toast.success("Biometric profile added successfully");
    } catch (err) {
      setError("Failed to add profile");
      toast.error("Failed to add biometric profile");
    } finally {
      addProfileInProgress.current = false;
    }
  };

  const createAccessRequest = async (e) => {
    e.preventDefault();
    if (addRequestInProgress.current) return;
    addRequestInProgress.current = false;
    const sanitizedRequest = {
      resource: sanitizeInput(newRequest.resource),
      access_level: newRequest.access_level,
      reason: sanitizeInput(newRequest.reason)
    };
    try {
      await api.post("/ztna/access-requests/", sanitizedRequest);
      setShowAddRequest(false);
      setNewRequest({ resource: "", access_level: "medium", reason: "" });
      fetchData();
      toast.success("Access request created successfully");
    } catch (err) {
      setError("Failed to create request");
      toast.error("Failed to create access request");
    } finally {
      addRequestInProgress.current = false;
    }
  };

  const menuItems = [
    { id: "biometric", label: "Biometric Profiles", icon: "M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.858.567-4.163" },
    { id: "web3", label: "Web3 Identity", icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" },
    { id: "access", label: "Access Profiles", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    { id: "requests", label: "Access Requests", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
  ];

  const getSeverityColor = (score) => {
    if (score >= 80) return { bg: "#dcfce7", text: "#16a34a" };
    if (score >= 50) return { bg: "#fef3c7", text: "#d97706" };
    return { bg: "#fef2f2", text: "#dc2626" };
  };

  if (loading && biometricProfiles.length === 0) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
        <p>Loading ZTNA...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <Link to="/dashboard" className="sidebar-logo">
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
              <h1>Zero-Trust Network Access</h1>
              <p>Manage identity-based access control</p>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {error && <div className="alert alert-error">{error}</div>}

          {activeTab === "biometric" && (
            <div className="tab-panel">
              <div className="card full-width">
                <div className="card-header">
                  <h3>Biometric Profiles</h3>
                  <button className="btn btn-primary" onClick={() => setShowAddProfile(true)}>Add Profile</button>
                </div>
                <div className="card-body">
                  {biometricProfiles.length === 0 ? (
                    <div className="empty-state">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.858.567-4.163" /></svg>
                      <p>No biometric profiles</p>
                      <span>Add a biometric profile to get started</span>
                    </div>
                  ) : (
                    <div className="incidents-grid">
                      {biometricProfiles.map((profile) => (
                        <div key={profile.id} className="incident-card">
                          <div className="incident-card-header">
                            <h3 title={escapeHtml(profile.device_id)}>{escapeHtml(profile.device_id)}</h3>
                            <span className={`badge ${profile.is_verified ? "badge-success" : "badge-warning"}`}>
                              {profile.is_verified ? "Verified" : "Pending"}
                            </span>
                          </div>
                          <div className="incident-card-body">
                            <p>Type: {escapeHtml(profile.device_type)}</p>
                            <p>Trust Score: {profile.behavioral_score || 0}</p>
                            <button className="btn btn-sm btn-primary" onClick={() => verifyBiometric(profile.id)} disabled={loading}>
                              Verify
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

          {activeTab === "web3" && (
            <div className="tab-panel">
              <div className="card full-width">
                <div className="card-header">
                  <h3>Web3 Identity</h3>
                </div>
                <div className="card-body">
                  {web3Identity?.connected ? (
                    <div className="audit-result success">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      <div>
                        <h4>Wallet Connected</h4>
                        <p title={escapeHtml(web3Identity.address)}>{escapeHtml(web3Identity.address)}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                      <p>Connect your wallet</p>
                      <button className="btn btn-primary" onClick={connectWallet}>Connect MetaMask</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "access" && (
            <div className="tab-panel">
              <div className="card full-width">
                <div className="card-header">
                  <h3>Access Profiles & Trust Scores</h3>
                </div>
                <div className="card-body">
                  {accessProfiles.length === 0 ? (
                    <div className="empty-state">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      <p>No access profiles</p>
                    </div>
                  ) : (
                    <div className="incidents-grid">
                      {accessProfiles.map((profile) => {
                        const colors = getSeverityColor(profile.trust_score || 0);
                        return (
                          <div key={profile.id} className="incident-card">
                            <div className="incident-card-header">
                              <h3 title={escapeHtml(profile.name)}>{escapeHtml(profile.name)}</h3>
                              <span className="incident-status" style={{ background: colors.bg, color: colors.text }}>
                                Score: {profile.trust_score || 0}
                              </span>
                            </div>
                            <div className="incident-card-body">
                              <p>Active Sessions: {profile.active_sessions || 0}</p>
                              <p>Last Access: {profile.last_access ? new Date(profile.last_access).toLocaleDateString() : "N/A"}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "requests" && (
            <div className="tab-panel">
              <div className="card full-width">
                <div className="card-header">
                  <h3>Just-In-Time Access Requests</h3>
                  <button className="btn btn-primary" onClick={() => setShowAddRequest(true)}>New Request</button>
                </div>
                <div className="card-body">
                  {accessRequests.length === 0 ? (
                    <div className="empty-state">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                      <p>No access requests</p>
                    </div>
                  ) : (
                    <div className="incidents-grid">
                      {accessRequests.map((request) => (
                        <div key={request.id} className="incident-card">
                          <div className="incident-card-header">
                            <h3 title={escapeHtml(request.resource)}>{escapeHtml(request.resource)}</h3>
                            <span className={`badge badge-${request.status === "approved" ? "success" : request.status === "pending" ? "warning" : "danger"}`}>
                              {escapeHtml(request.status)}
                            </span>
                          </div>
                          <div className="incident-card-body">
                            <p>Access Level: {escapeHtml(request.access_level)}</p>
                            <p>Requested: {request.created_at ? new Date(request.created_at).toLocaleDateString() : "N/A"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {showAddProfile && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>Add Biometric Profile</h3>
                  <button onClick={() => setShowAddProfile(false)}>&times;</button>
                </div>
                <form onSubmit={addBiometricProfile}>
                  <div className="form-group">
                    <label>Device ID</label>
                    <input type="text" value={newProfile.device_id} onChange={(e) => setNewProfile({ ...newProfile, device_id: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Device Type</label>
                    <select value={newProfile.device_type} onChange={(e) => setNewProfile({ ...newProfile, device_type: e.target.value })}>
                      <option value="laptop">Laptop</option>
                      <option value="mobile">Mobile</option>
                      <option value="tablet">Tablet</option>
                      <option value="desktop">Desktop</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">Add Profile</button>
                </form>
              </div>
            </div>
          )}

          {showAddRequest && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>Create Access Request</h3>
                  <button onClick={() => setShowAddRequest(false)}>&times;</button>
                </div>
                <form onSubmit={createAccessRequest}>
                  <div className="form-group">
                    <label>Resource</label>
                    <input type="text" value={newRequest.resource} onChange={(e) => setNewRequest({ ...newRequest, resource: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Access Level</label>
                    <select value={newRequest.access_level} onChange={(e) => setNewRequest({ ...newRequest, access_level: e.target.value })}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Reason</label>
                    <input type="text" value={newRequest.reason} onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })} />
                  </div>
                  <button type="submit" className="btn btn-primary">Submit Request</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ZTNA;
