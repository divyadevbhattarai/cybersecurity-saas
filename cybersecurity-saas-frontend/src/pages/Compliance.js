import React, { useState } from "react";
import { Link } from "react-router-dom";

function Compliance() {
  const [activeTab, setActiveTab] = useState("soc2");

  const standards = {
    soc2: {
      name: "SOC 2 Type II",
      description: "Service Organization Control 2 - Security, Availability, Processing Integrity, Confidentiality, and Privacy controls",
      lastAudit: "2026-02-15",
      status: "Compliant",
      controls: [
        { id: "CC1.1", name: "Control Environment", status: "pass", evidence: "Policy documents, org structure" },
        { id: "CC2.1", name: "Communication and Information", status: "pass", evidence: "Security awareness training logs" },
        { id: "CC3.1", name: "Risk Assessment", status: "pass", evidence: "Risk assessment matrix" },
        { id: "CC4.1", name: "Monitoring Activities", status: "pass", evidence: "SIEM dashboards, audit logs" },
        { id: "CC5.1", name: "Control Activities", status: "pass", evidence: "Access control matrix" },
        { id: "CC6.1", name: "Logical and Physical Access", status: "pass", evidence: "MFA logs, badge access" },
        { id: "CC7.1", name: "System Operations", status: "pass", evidence: "Backup verification" },
        { id: "CC8.1", name: "Change Management", status: "pass", evidence: "Change request logs" },
      ],
    },
    iso27001: {
      name: "ISO 27001:2022",
      description: "International standard for Information Security Management Systems (ISMS)",
      lastAudit: "2026-01-20",
      status: "Certified",
      controls: [
        { id: "A.5.1", name: "Information Security Policies", status: "pass", evidence: "Policy v2.1" },
        { id: "A.6.1", name: "Organization of Information Security", status: "pass", evidence: "Org chart, roles" },
        { id: "A.7.1", name: "Human Resource Security", status: "pass", evidence: "Background checks" },
        { id: "A.8.1", name: "Asset Management", status: "pass", evidence: "Asset inventory" },
        { id: "A.8.5", name: "Secure Configuration", status: "pass", evidence: "Hardening guides" },
        { id: "A.8.9", name: "Configuration Management", status: "pass", evidence: "CMDB" },
        { id: "A.9.1", name: "Access Control", status: "pass", evidence: "IAM policies" },
        { id: "A.9.4", name: "System and Application Access", status: "pass", evidence: "MFA enforcement" },
      ],
    },
    hipaa: {
      name: "HIPAA",
      description: "Health Insurance Portability and Accountability Act - Protection of PHI",
      lastAudit: "2025-12-10",
      status: "Compliant",
      controls: [
        { id: "164.308", name: "Administrative Safeguards", status: "pass", evidence: "Security officer appointment" },
        { id: "164.310", name: "Physical Safeguards", status: "pass", evidence: "Data center access logs" },
        { id: "164.312", name: "Technical Safeguards", status: "pass", evidence: "Encryption policies" },
        { id: "164.514", name: "De-identification", status: "pass", evidence: "De-id procedures" },
      ],
    },
    gdpr: {
      name: "GDPR",
      description: "General Data Protection Regulation - EU data privacy compliance",
      lastAudit: "2026-02-01",
      status: "Compliant",
      controls: [
        { id: "Art.25", name: "Data Protection by Design", status: "pass", evidence: "DPIA records" },
        { id: "Art.30", name: "Records of Processing", status: "pass", evidence: "Processing register" },
        { id: "Art.32", name: "Security of Processing", status: "pass", evidence: "Security measures" },
        { id: "Art.33", name: "Breach Notification", status: "pass", evidence: "Incident response plan" },
      ],
    },
  };

  const complianceScore = () => {
    let passed = 0;
    let total = 0;
    Object.values(standards).forEach((std) => {
      std.controls.forEach((control) => {
        total++;
        if (control.status === "pass") passed++;
      });
    });
    return Math.round((passed / total) * 100);
  };

  const currentStandard = standards[activeTab];

  return (
    <div className="compliance-page">
      <div className="page-header">
        <div>
          <h1>Compliance Dashboard</h1>
          <p>Monitor compliance with industry security standards</p>
        </div>
        <Link to="/dashboard" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>

      <div className="compliance-overview">
        <div className="compliance-score-card">
          <div className="score-circle" style={{ borderColor: complianceScore() >= 90 ? "#16a34a" : complianceScore() >= 70 ? "#d97706" : "#dc2626" }}>
            <span className="score-value">{complianceScore()}%</span>
            <span className="score-label">Overall</span>
          </div>
          <div className="score-details">
            <h3>Compliance Score</h3>
            <p>Based on all active standards</p>
          </div>
        </div>

        <div className="standards-grid">
          {Object.entries(standards).map(([key, std]) => (
            <div key={key} className={`standard-card ${activeTab === key ? "active" : ""}`} onClick={() => setActiveTab(key)}>
              <div className="standard-header">
                <h3>{std.name}</h3>
                <span className={`status-badge ${std.status.toLowerCase()}`}>{std.status}</span>
              </div>
              <p className="standard-desc">{std.description}</p>
              <div className="standard-meta">
                <span>Last Audit: {std.lastAudit}</span>
                <span>{std.controls.filter((c) => c.status === "pass").length}/{std.controls.length} controls</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="controls-section">
        <div className="section-header">
          <h2>{currentStandard.name} Controls</h2>
          <p>{currentStandard.description}</p>
        </div>

        <div className="controls-table">
          <div className="table-header">
            <span>Control ID</span>
            <span>Control Name</span>
            <span>Status</span>
            <span>Evidence</span>
          </div>
          {currentStandard.controls.map((control) => (
            <div key={control.id} className="table-row">
              <span className="control-id">{control.id}</span>
              <span className="control-name">{control.name}</span>
              <span className={`control-status ${control.status}`}>
                {control.status === "pass" ? "✓ Pass" : "✗ Fail"}
              </span>
              <span className="control-evidence">{control.evidence}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="audit-schedule">
        <h3>Upcoming Audits</h3>
        <div className="schedule-list">
          <div className="schedule-item">
            <div className="schedule-date">
              <span className="month">MAR</span>
              <span className="day">15</span>
            </div>
            <div className="schedule-info">
              <h4>Internal SOC 2 Audit</h4>
              <p>Quarterly internal control review</p>
            </div>
          </div>
          <div className="schedule-item">
            <div className="schedule-date">
              <span className="month">APR</span>
              <span className="day">22</span>
            </div>
            <div className="schedule-info">
              <h4>ISO 27001 Surveillance</h4>
              <p>Annual surveillance audit</p>
            </div>
          </div>
          <div className="schedule-item">
            <div className="schedule-date">
              <span className="month">MAY</span>
              <span className="day">10</span>
            </div>
            <div className="schedule-info">
              <h4>GDPR Compliance Review</h4>
              <p>Data processing assessment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Compliance;
