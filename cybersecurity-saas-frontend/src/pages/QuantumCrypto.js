import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../services/axios";
import { logoutUser } from "../store/authActions";

function QuantumCrypto() {
  const [activeTab, setActiveTab] = useState("keys");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [keys, setKeys] = useState([]);
  const [rotationHistory, setRotationHistory] = useState([]);
  const [algorithms, setAlgorithms] = useState([]);
  const [showCreateKey, setShowCreateKey] = useState(false);
  const [newKey, setNewKey] = useState({ name: "", algorithm: "kyber512", key_size: 256 });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [keyRes, rotationRes, algoRes] = await Promise.all([
        api.get("/quantum-crypto/keys/"),
        api.get("/quantum-crypto/rotation-history/"),
        api.get("/quantum-crypto/algorithms/"),
      ]);
      setKeys(keyRes.data || []);
      setRotationHistory(rotationRes.data || []);
      setAlgorithms(algoRes.data || []);
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

  const createKey = async (e) => {
    e.preventDefault();
    try {
      await api.post("/quantum-crypto/keys/", newKey);
      setShowCreateKey(false);
      setNewKey({ name: "", algorithm: "kyber512", key_size: 256 });
      fetchData();
    } catch (err) {
      setError("Failed to create key");
    }
  };

  const rotateKey = async (keyId) => {
    try {
      setLoading(true);
      await api.post(`/quantum-crypto/keys/${keyId}/rotate/`);
      fetchData();
    } catch (err) {
      console.error("Error rotating key", err);
    } finally {
      setLoading(false);
    }
  };

  const updateAlgorithm = async (algoId, enabled) => {
    try {
      setLoading(true);
      await api.patch(`/quantum-crypto/algorithms/${algoId}/`, { enabled: !enabled });
      fetchData();
    } catch (err) {
      console.error("Error updating algorithm", err);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: "keys", label: "Encryption Keys", icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" },
    { id: "rotation", label: "Rotation History", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
    { id: "algorithms", label: "Algorithms", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
  ];

  const getStatusBadge = (status) => {
    const colors = {
      active: { bg: "#dcfce7", text: "#16a34a" },
      expired: { bg: "#fef2f2", text: "#dc2626" },
      pending: { bg: "#fef3c7", text: "#d97706" },
    };
    const c = colors[status] || colors.active;
    return <span className="badge" style={{ background: c.bg, color: c.text }}>{status}</span>;
  };

  if (loading && keys.length === 0) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
        <p>Loading Quantum Crypto...</p>
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
              <h1>Quantum-Resistant Cryptography</h1>
              <p>Post-quantum encryption key management</p>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {error && <div className="alert alert-error">{error}</div>}

          {activeTab === "keys" && (
            <div className="tab-panel">
              <div className="card full-width">
                <div className="card-header">
                  <h3>Encryption Keys</h3>
                  <button className="btn btn-primary" onClick={() => setShowCreateKey(true)}>Generate Key</button>
                </div>
                <div className="card-body">
                  {keys.length === 0 ? (
                    <div className="empty-state">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                      <p>No encryption keys</p>
                      <span>Generate a quantum-resistant key</span>
                    </div>
                  ) : (
                    <div className="incidents-grid">
                      {keys.map((key) => (
                        <div key={key.id} className="incident-card">
                          <div className="incident-card-header">
                            <h3>{key.name}</h3>
                            {getStatusBadge(key.status)}
                          </div>
                          <div className="incident-card-body">
                            <p>Algorithm: {key.algorithm}</p>
                            <p>Key Size: {key.key_size} bits</p>
                            <p>Created: {key.created_at ? new Date(key.created_at).toLocaleDateString() : "N/A"}</p>
                            <p>Expires: {key.expires_at ? new Date(key.expires_at).toLocaleDateString() : "N/A"}</p>
                            <button className="btn btn-sm btn-primary" onClick={() => rotateKey(key.id)} disabled={loading}>
                              Rotate Key
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

          {activeTab === "rotation" && (
            <div className="tab-panel">
              <div className="card full-width">
                <div className="card-header">
                  <h3>Key Rotation History</h3>
                </div>
                <div className="card-body">
                  {rotationHistory.length === 0 ? (
                    <div className="empty-state">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      <p>No rotation history</p>
                    </div>
                  ) : (
                    <div className="table-container">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Key Name</th>
                            <th>Old Key ID</th>
                            <th>New Key ID</th>
                            <th>Rotated By</th>
                            <th>Timestamp</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rotationHistory.map((rotation) => (
                            <tr key={rotation.id}>
                              <td>{rotation.key_name}</td>
                              <td>{rotation.old_key_id?.substring(0, 8)}...</td>
                              <td>{rotation.new_key_id?.substring(0, 8)}...</td>
                              <td>{rotation.rotated_by}</td>
                              <td>{rotation.timestamp ? new Date(rotation.timestamp).toLocaleString() : "N/A"}</td>
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

          {activeTab === "algorithms" && (
            <div className="tab-panel">
              <div className="card full-width">
                <div className="card-header">
                  <h3>Algorithm Configuration</h3>
                </div>
                <div className="card-body">
                  {algorithms.length === 0 ? (
                    <div className="empty-state">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                      <p>No algorithms configured</p>
                    </div>
                  ) : (
                    <div className="incidents-grid">
                      {algorithms.map((algo) => (
                        <div key={algo.id} className="incident-card">
                          <div className="incident-card-header">
                            <h3>{algo.name}</h3>
                            <label className="switch">
                              <input type="checkbox" checked={algo.enabled} onChange={() => updateAlgorithm(algo.id, algo.enabled)} />
                              <span className="slider"></span>
                            </label>
                          </div>
                          <div className="incident-card-body">
                            <p>Type: {algo.algorithm_type}</p>
                            <p>Security Level: {algo.security_level} bits</p>
                            <p>Status: {algo.enabled ? "Enabled" : "Disabled"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {showCreateKey && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>Generate Quantum-Resistant Key</h3>
                  <button onClick={() => setShowCreateKey(false)}>&times;</button>
                </div>
                <form onSubmit={createKey}>
                  <div className="form-group">
                    <label>Key Name</label>
                    <input type="text" value={newKey.name} onChange={(e) => setNewKey({ ...newKey, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Algorithm</label>
                    <select value={newKey.algorithm} onChange={(e) => setNewKey({ ...newKey, algorithm: e.target.value })}>
                      <option value="kyber512">Kyber-512</option>
                      <option value="kyber768">Kyber-768</option>
                      <option value="kyber1024">Kyber-1024</option>
                      <option value="dilithium2">Dilithium-2</option>
                      <option value="dilithium3">Dilithium-3</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Key Size (bits)</label>
                    <select value={newKey.key_size} onChange={(e) => setNewKey({ ...newKey, key_size: parseInt(e.target.value) })}>
                      <option value={128}>128</option>
                      <option value={192}>192</option>
                      <option value={256}>256</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">Generate</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default QuantumCrypto;
