import React from "react";
import ProductPage from "./ProductPage";

function SOARPage() {
  const data = {
    title: "Security Orchestration",
    subtitle: "Automate your security operations with intelligent playbooks and rapid incident response powered by AI.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    gradient: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
    overview: "Security Orchestration, Automation, and Response (SOAR) platform enables organizations to collect security threats data, automate incident response workflows, and orchestrate security tools across the environment. By automating repetitive tasks and providing a unified view of security operations, SOAR helps security teams respond faster and more efficiently to threats. CyberShield SOAR integrates seamlessly with your existing security stack to provide end-to-end automation of threat detection, investigation, and response activities.",
    capabilities: [
      {
        title: "Playbook Automation",
        description: "Create visual workflows to automate response actions based on threat severity and type. Drag-and-drop playbook builder enables security teams to design complex automation flows without coding, reducing mean time to response from hours to minutes.",
        icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
        color: "#ef4444"
      },
      {
        title: "Threat Intelligence",
        description: "Integrate with global threat intelligence feeds to enrich alerts with contextual data. Automatically correlate indicators of compromise against multiple threat intelligence sources to prioritize and classify security events accurately.",
        icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
        color: "#f87171"
      },
      {
        title: "Case Management",
        description: "Unified incident tracking with collaboration tools for cross-functional teams. Assign tasks, track progress, and maintain complete audit trails of all actions taken during incident response with built-in collaboration features.",
        icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
        color: "#fca5a5"
      },
      {
        title: "Tool Integration",
        description: "Connect with 200+ security tools including SIEM, EDR, firewall, and cloud security. Pre-built integrations accelerate deployment while custom API connectors enable orchestration of proprietary and specialized security tools.",
        icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z",
        color: "#dc2626"
      },
      {
        title: "Automated Enrichment",
        description: "Automatically gather IoCs, threat context, and asset information for rapid triage. Enrich alerts with threat actor information, known malicious patterns, and affected asset details to accelerate investigation and decision-making.",
        icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
        color: "#b91c1c"
      },
      {
        title: "Metrics & Reporting",
        description: "Real-time dashboards and compliance reports to measure security operations effectiveness. Track KPIs like MTTD, MTTR, and analyst productivity with customizable reports for stakeholders and compliance auditors.",
        icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
        color: "#7f1d1d"
      }
    ],
    useCases: [
      {
        title: "Phishing Response",
        description: "Automate email analysis, URL scanning, user notification, and account remediation when phishing is detected. Reduce dwell time from hours to minutes by automatically isolating compromised accounts and blocking malicious URLs."
      },
      {
        title: "Malware Containment",
        description: "Isolate infected endpoints, kill malicious processes, and collect forensic evidence automatically. Accelerate containment while preserving forensic artifacts for investigation and threat hunting activities."
      },
      {
        title: "Vulnerability Management",
        description: "Prioritize and remediate vulnerabilities based on asset criticality and exploitability. Automatically create tickets, assign remediation tasks, and track progress through to completion with risk-based prioritization."
      },
      {
        title: "Insider Threat Investigation",
        description: "Correlate user behavior signals, gather evidence, and streamline investigation workflows. Build comprehensive timelines of user activity to determine scope and impact of potential insider threats."
      }
    ],
    architecture: {
      description: "The SOAR architecture integrates with your existing security infrastructure to provide centralized automation, orchestration, and response capabilities across the entire security stack. The platform serves as the central nervous system for your security operations.",
      diagram: (
        <>
          <rect x="50" y="150" width="100" height="50" rx="6" fill="#1e1b4b" stroke="#ef4444" strokeWidth="2" />
          <text x="100" y="180" textAnchor="middle" fill="#fff" fontSize="11">SIEM</text>
          
          <rect x="180" y="150" width="100" height="50" rx="6" fill="#1e1b4b" stroke="#ef4444" strokeWidth="2" />
          <text x="230" y="180" textAnchor="middle" fill="#fff" fontSize="11">EDR</text>
          
          <rect x="310" y="120" width="140" height="100" rx="8" fill="#1e1b4b" stroke="#ef4444" strokeWidth="2" />
          <text x="380" y="155" textAnchor="middle" fill="#fff" fontSize="12">SOAR Platform</text>
          <text x="380" y="175" textAnchor="middle" fill="#94a3b8" fontSize="10">Playbook Engine</text>
          <text x="380" y="195" textAnchor="middle" fill="#94a3b8" fontSize="10">Case Manager</text>
          
          <rect x="480" y="150" width="100" height="50" rx="6" fill="#1e1b4b" stroke="#f87171" strokeWidth="2" />
          <text x="530" y="180" textAnchor="middle" fill="#fff" fontSize="11">Firewall</text>
          
          <rect x="480" y="230" width="100" height="50" rx="6" fill="#1e1b4b" stroke="#f87171" strokeWidth="2" />
          <text x="530" y="260" textAnchor="middle" fill="#fff" fontSize="11">Email Security</text>
          
          <path d="M150 175 L180 175" stroke="#ef4444" strokeWidth="2" />
          <path d="M280 175 L310 160" stroke="#ef4444" strokeWidth="2" />
          <path d="M450 175 L480 175" stroke="#ef4444" strokeWidth="2" />
          <path d="M380 220 L380 230" stroke="#f87171" strokeWidth="2" />
          
          <circle cx="380" cy="50" r="25" fill="none" stroke="#ef4444" strokeWidth="2">
            <animate attributeName="r" values="25;30;25" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x="380" y="55" textAnchor="middle" fill="#fff" fontSize="9">Alerts</text>
          <path d="M380 75 L380 120" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" />
        </>
      )
    },
    benefits: [
      { value: "70%", label: "Faster Response Time", description: "Reduce mean time to respond (MTTR) through automated playbooks and workflows." },
      { value: "50%", label: "Reduced Alert Fatigue", description: "Automate Tier-1 investigations and prioritize critical threats for analysts." },
      { value: "24/7", label: "Automated Coverage", description: "Maintain security monitoring and response even outside business hours." },
      { value: "3x", label: "Analyst Productivity", description: "Free up security teams to focus on strategic initiatives." }
    ]
  };

  return <ProductPage {...data} />;
}

export default SOARPage;
