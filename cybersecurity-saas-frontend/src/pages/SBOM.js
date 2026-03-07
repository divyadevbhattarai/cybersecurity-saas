import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../services/axios";
import { logoutUser } from "../store/authActions";

function SBOM() {
  const [activeTab, setActiveTab] = useState("projects");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error] = useState(null);
  const [projects, setProjects] = useState([]);
  const [components, setComponents] = useState([]);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projRes, vulnRes] = await Promise.all([
        api.get("/sbom/projects/"),
        api.get("/sbom/vulnerabilities/"),
      ]);
      setProjects(projRes.data || []);
      setVulnerabilities(vulnRes.data || []);
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

  const fetchComponents = async (projectId) => {
    try {
      setLoading(true);
      const res = await api.get(`/sbom/projects/${projectId}/components/`);
      setComponents(res.data || []);
      setSelectedProject(projects.find(p => p.id === projectId));
      setSelectedComponent(null);
    } catch (err) {
      console.error("Error fetching components", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComponentVulnerabilities = async (componentId) => {
    try {
      setLoading(true);
      const res = await api.get(`/sbom/components/${componentId}/vulnerabilities/`);
      setSelectedComponent({ ...components.find(c => c.id === componentId), vulnerabilities: res.data || [] });
    } catch (err) {
      console.error("Error fetching vulnerabilities", err);
    } finally {
      setLoading(false);
    }
  };

  const exportSBOM = async (projectId, format) => {
    try {
      const res = await api.get(`/sbom/projects/${projectId}/export/`, { params: { format } });
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sbom-${projectId}.${format}`;
      a.click();
    } catch (err) {
      console.error("Error exporting SBOM", err);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: { bg: "#fef2f2", text: "#dc2626" },
      high: { bg: "#fff7ed", text: "#ea580c" },
      medium: { bg: "#fef3c7", text: "#d97706" },
      low: { bg: "#dbeafe", text: "#2563eb" },
    };
    return colors[severity?.toLowerCase()] || colors.low;
  };

  const menuItems = [
    { id: "projects", label: "Projects", icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" },
    { id: "vulnerabilities", label: "Vulnerabilities", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
  ];

  if (loading && projects.length === 0) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
        <p>Loading SBOM...</p>
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
              <h1>Software Bill of Materials</h1>
              <p>Track components and vulnerabilities</p>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {error && <div className="alert alert-error">{error}</div>}

          {activeTab === "projects" && (
            <div className="tab-panel">
              {!selectedProject ? (
                <div className="card full-width">
                  <div className="card-header">
                    <h3>Projects</h3>
                  </div>
                  <div className="card-body">
                    {projects.length === 0 ? (
                      <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                        <p>No projects found</p>
                      </div>
                    ) : (
                      <div className="incidents-grid">
                        {projects.map((project) => (
                          <div key={project.id} className="incident-card" onClick={() => fetchComponents(project.id)}>
                            <div className="incident-card-header">
                              <h3>{project.name}</h3>
                              <span className="badge badge-info">{project.component_count || 0} components</span>
                            </div>
                            <div className="incident-card-body">
                              <p>Version: {project.version}</p>
                              <p>Last Scanned: {project.last_scanned ? new Date(project.last_scanned).toLocaleDateString() : "Never"}</p>
                              <div style={{ marginTop: "10px" }}>
                                <button className="btn btn-sm btn-primary" onClick={(e) => { e.stopPropagation(); exportSBOM(project.id, "json"); }}>Export JSON</button>
                                <button className="btn btn-sm btn-secondary" style={{ marginLeft: "5px" }} onClick={(e) => { e.stopPropagation(); exportSBOM(project.id, "spdx"); }}>Export SPDX</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : !selectedComponent ? (
                <div className="card full-width">
                  <div className="card-header">
                    <button className="btn btn-sm btn-secondary" onClick={() => setSelectedProject(null)}>&larr; Back</button>
                    <h3>{selectedProject.name} - Components</h3>
                  </div>
                  <div className="card-body">
                    {components.length === 0 ? (
                      <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z" /></svg>
                        <p>No components found</p>
                      </div>
                    ) : (
                      <div className="incidents-grid">
                        {components.map((component) => (
                          <div key={component.id} className="incident-card" onClick={() => fetchComponentVulnerabilities(component.id)}>
                            <div className="incident-card-header">
                              <h3>{component.name}</h3>
                              <span className="badge badge-warning">{component.vulnerability_count || 0} vulns</span>
                            </div>
                            <div className="incident-card-body">
                              <p>Version: {component.version}</p>
                              <p>Type: {component.component_type}</p>
                              <p>License: {component.license || "Unknown"}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="card full-width">
                  <div className="card-header">
                    <button className="btn btn-sm btn-secondary" onClick={() => setSelectedComponent(null)}>&larr; Back</button>
                    <h3>{selectedComponent.name} Vulnerabilities</h3>
                  </div>
                  <div className="card-body">
                    {selectedComponent.vulnerabilities?.length === 0 ? (
                      <div className="empty-state success">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p>No vulnerabilities found</p>
                      </div>
                    ) : (
                      <div className="table-container">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>CVE ID</th>
                              <th>Severity</th>
                              <th>Description</th>
                              <th>Fixed In</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedComponent.vulnerabilities?.map((vuln) => {
                              const colors = getSeverityColor(vuln.severity);
                              return (
                                <tr key={vuln.id}>
                                  <td><a href={`https://nvd.nist.gov/vuln/detail/${vuln.cve_id}`} target="_blank" rel="noopener noreferrer">{vuln.cve_id}</a></td>
                                  <td><span className="badge" style={{ background: colors.bg, color: colors.text }}>{vuln.severity}</span></td>
                                  <td>{vuln.description}</td>
                                  <td>{vuln.fixed_in || "N/A"}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "vulnerabilities" && (
            <div className="tab-panel">
              <div className="card full-width">
                <div className="card-header">
                  <h3>All Vulnerabilities</h3>
                </div>
                <div className="card-body">
                  {vulnerabilities.length === 0 ? (
                    <div className="empty-state">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      <p>No vulnerabilities tracked</p>
                    </div>
                  ) : (
                    <div className="table-container">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>CVE ID</th>
                            <th>Component</th>
                            <th>Severity</th>
                            <th>Status</th>
                            <th>Discovered</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vulnerabilities.map((vuln) => {
                            const colors = getSeverityColor(vuln.severity);
                            return (
                              <tr key={vuln.id}>
                                <td><a href={`https://nvd.nist.gov/vuln/detail/${vuln.cve_id}`} target="_blank" rel="noopener noreferrer">{vuln.cve_id}</a></td>
                                <td>{vuln.component_name}</td>
                                <td><span className="badge" style={{ background: colors.bg, color: colors.text }}>{vuln.severity}</span></td>
                                <td><span className={`badge ${vuln.status === "fixed" ? "badge-success" : "badge-danger"}`}>{vuln.status}</span></td>
                                <td>{vuln.discovered_at ? new Date(vuln.discovered_at).toLocaleDateString() : "N/A"}</td>
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
        </div>
      </main>
    </div>
  );
}

export default SBOM;
