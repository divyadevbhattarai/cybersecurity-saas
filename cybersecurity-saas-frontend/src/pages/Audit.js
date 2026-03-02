import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../services/axios";
import { logoutUser } from "../store/authActions";

function Audit() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [filters, setFilters] = useState({ user: "", action: "", date: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.user) params.user = filters.user;
      if (filters.action) params.action = filters.action;
      if (filters.date) params.date = filters.date;
      const response = await api.get("/audit/logs/", { params });
      setAuditLogs(response.data || []);
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

  const verifyOnBlockchain = async (logId) => {
    try {
      setLoading(true);
      const response = await api.post(`/audit/logs/${logId}/verify/`);
      setAuditLogs(auditLogs.map(log => log.id === logId ? { ...log, blockchain_verified: response.data.verified } : log));
    } catch (err) {
      console.error("Error verifying log", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        log.action?.toLowerCase().includes(query) ||
        log.user?.toLowerCase().includes(query) ||
        log.details?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const menuItems = [
    { id: "logs", label: "Audit Logs", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  ];

  if (loading && auditLogs.length === 0) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
        <p>Loading Audit Logs...</p>
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
          <button className="sidebar-link active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <span>Audit Logs</span>
          </button>
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
              <h1>Audit Trail</h1>
              <p>Track all system activities with blockchain verification</p>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="card full-width">
            <div className="card-header">
              <h3>Searchable Audit Log</h3>
            </div>
            <div className="card-body">
              <div className="filter-row" style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control"
                  style={{ maxWidth: "300px" }}
                />
                <select
                  value={filters.user}
                  onChange={(e) => setFilters({ ...filters, user: e.target.value })}
                  className="form-control"
                  style={{ maxWidth: "200px" }}
                >
                  <option value="">All Users</option>
                  {[...new Set(auditLogs.map(l => l.user))].map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
                <select
                  value={filters.action}
                  onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                  className="form-control"
                  style={{ maxWidth: "200px" }}
                >
                  <option value="">All Actions</option>
                  {[...new Set(auditLogs.map(l => l.action))].map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                  className="form-control"
                  style={{ maxWidth: "200px" }}
                />
              </div>

              {filteredLogs.length === 0 ? (
                <div className="empty-state">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <p>No audit logs found</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>User</th>
                        <th>Action</th>
                        <th>Details</th>
                        <th>IP Address</th>
                        <th>Blockchain</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLogs.map((log) => (
                        <tr key={log.id}>
                          <td>{log.timestamp ? new Date(log.timestamp).toLocaleString() : "N/A"}</td>
                          <td>{log.user}</td>
                          <td><span className="badge badge-info">{log.action}</span></td>
                          <td>{log.details}</td>
                          <td>{log.ip_address}</td>
                          <td>
                            {log.blockchain_verified ? (
                              <span className="badge badge-success">Verified</span>
                            ) : (
                              <button className="btn btn-sm btn-secondary" onClick={() => verifyOnBlockchain(log.id)} disabled={loading}>
                                Verify
                              </button>
                            )}
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
      </main>
    </div>
  );
}

export default Audit;
