import React from "react";
import ProductPage from "./ProductPage";

function IncidentResponsePage() {
  const data = {
    title: "Incident Response",
    subtitle: "Automated incident response to contain threats and minimize damage in real-time.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    gradient: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
    overview: "CyberShield Incident Response enables organizations to rapidly detect, investigate, and respond to security incidents. Our automated response capabilities help contain threats before they cause damage, reducing downtime and minimizing the impact of security breaches. The platform provides a unified console for managing the entire incident lifecycle from initial detection through post-incident analysis.",
    capabilities: [
      {
        title: "Automated Containment",
        description: "Automatically isolate affected systems, block malicious IPs, and disable compromised accounts. Execute pre-defined containment actions within seconds of detection to prevent threat spread and minimize damage.",
        icon: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
        color: "#ef4444"
      },
      {
        title: "Playbook Automation",
        description: "Execute predefined response workflows based on incident type and severity. Drag-and-drop playbook builder enables security teams to automate complex response sequences without coding.",
        icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
        color: "#f87171"
      },
      {
        title: "Forensic Collection",
        description: "Automatically gather evidence and maintain chain of custody for investigations. Collect memory dumps, disk images, network captures, and logs while preserving legal admissibility.",
        icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        color: "#fca5a5"
      },
      {
        title: "Threat Hunting",
        description: "Proactively search for indicators of compromise across your environment. Leverage threat intelligence and behavioral analytics to identify hidden threats before they activate.",
        icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
        color: "#dc2626"
      },
      {
        title: "Integration with SOAR",
        description: "Seamlessly orchestrate response actions across your security stack. Connect with EDR, NDR, SIEM, firewall, and cloud security tools for coordinated response.",
        icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z",
        color: "#b91c1c"
      },
      {
        title: "Post-Incident Analysis",
        description: "Comprehensive root cause analysis and lessons learned reporting. Automatically generate after-action reports with timeline reconstruction and remediation recommendations.",
        icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        color: "#7f1d1d"
      }
    ],
    useCases: [
      {
        title: "Ransomware Response",
        description: "Immediately isolate ransomware-affected systems and prevent lateral spread. Automatically kill malicious processes, disable network shares, and preserve encrypted files for recovery."
      },
      {
        title: "Data Breach Containment",
        description: "Rapidly identify and contain data exfiltration to limit exposure. Block unauthorized data transfers, revoke compromised credentials, and isolate affected systems."
      },
      {
        title: "Malware Outbreak",
        description: "Deploy containment measures across all affected endpoints simultaneously. Quarantine infected machines, block command and control traffic, and initiate remediation workflows."
      },
      {
        title: "Insider Incident",
        description: "Respond to insider threats while maintaining legal evidence preservation. Monitor user activity, preserve evidence, and coordinate with HR and legal teams."
      }
    ],
    architecture: {
      description: "The Incident Response platform integrates with your security tools to provide automated detection, containment, and recovery capabilities across your entire infrastructure.",
      diagram: (
        <>
          <rect x="40" y="60" width="120" height="50" rx="6" fill="#1e1b4b" stroke="#ef4444" strokeWidth="2" />
          <text x="100" y="90" textAnchor="middle" fill="#fff" fontSize="11">Detection</text>
          
          <rect x="200" y="60" width="120" height="50" rx="6" fill="#1e1b4b" stroke="#f87171" strokeWidth="2" />
          <text x="260" y="90" textAnchor="middle" fill="#fff" fontSize="11">Analysis</text>
          
          <rect x="360" y="60" width="120" height="50" rx="6" fill="#1e1b4b" stroke="#ef4444" strokeWidth="2" />
          <text x="420" y="90" textAnchor="middle" fill="#fff" fontSize="11">Containment</text>
          
          <rect x="520" y="60" width="120" height="50" rx="6" fill="#1e1b4b" stroke="#f87171" strokeWidth="2" />
          <text x="580" y="90" textAnchor="middle" fill="#fff" fontSize="11">Recovery</text>
          
          <rect x="200" y="180" width="160" height="100" rx="8" fill="#1e1b4b" stroke="#ef4444" strokeWidth="2" />
          <text x="280" y="215" textAnchor="middle" fill="#fff" fontSize="11">Response Playbooks</text>
          <text x="280" y="235" textAnchor="middle" fill="#94a3b8" fontSize="9">Automated Workflows</text>
          
          <rect x="400" y="180" width="120" height="100" rx="8" fill="#1e1b4b" stroke="#f87171" strokeWidth="2" />
          <text x="460" y="215" textAnchor="middle" fill="#fff" fontSize="11">Forensics</text>
          <text x="460" y="235" textAnchor="middle" fill="#94a3b8" fontSize="9">Evidence Collection</text>
          
          <rect x="300" y="320" width="160" height="60" rx="6" fill="#1e1b4b" stroke="#fca5a5" strokeWidth="2" />
          <text x="380" y="355" textAnchor="middle" fill="#fff" fontSize="11">Security Team</text>
          
          <path d="M160 85 L200 85" stroke="#ef4444" strokeWidth="2" />
          <path d="M320 85 L360 85" stroke="#f87171" strokeWidth="2" />
          <path d="M480 85 L520 85" stroke="#ef4444" strokeWidth="2" />
          
          <path d="M100 110 L280 180" stroke="#ef4444" strokeWidth="1" />
          <path d="M260 110 L280 180" stroke="#ef4444" strokeWidth="1" />
          <path d="M420 110 L460 180" stroke="#f87171" strokeWidth="1" />
          
          <path d="M360 280 L380 320" stroke="#fca5a5" strokeWidth="2" />
        </>
      )
    },
    benefits: [
      { value: "90%", label: "Faster Response", description: "Reduce mean time to respond with automated containment actions." },
      { value: "70%", label: "Less Damage", description: "Minimize breach impact with rapid incident isolation." },
      { value: "24/7", label: "Automated Coverage", description: "Maintain response capabilities around the clock." },
      { value: "100%", label: "Audit Trail", description: "Complete documentation for compliance and legal requirements." }
    ]
  };

  return <ProductPage {...data} />;
}

export default IncidentResponsePage;
