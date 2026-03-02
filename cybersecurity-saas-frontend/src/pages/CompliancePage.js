import React from "react";
import ProductPage from "./ProductPage";

function CompliancePage() {
  const data = {
    title: "Compliance Management",
    subtitle: "Automate compliance monitoring and reporting for SOC 2, ISO 27001, GDPR, and more.",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    gradient: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
    overview: "CyberShield Compliance provides automated continuous compliance monitoring across multiple frameworks. Streamline audits, reduce compliance costs, and maintain evidence automatically with real-time visibility into your security posture. The platform maps security controls to over 12 major compliance frameworks, enabling you to demonstrate compliance to auditors, customers, and regulators without manual effort.",
    capabilities: [
      {
        title: "Multi-Framework Support",
        description: "Support for SOC 2, ISO 27001, HIPAA, PCI DSS, GDPR, NIST, FedRAMP, and more. Maintain compliance with multiple frameworks simultaneously with unified control mapping and unified reporting.",
        icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
        color: "#ef4444"
      },
      {
        title: "Continuous Monitoring",
        description: "Real-time compliance status with automated evidence collection. Monitor security controls continuously rather than point-in-time assessments, catching drift immediately.",
        icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
        color: "#f87171"
      },
      {
        title: "Automated Evidence",
        description: "Automatically collect and organize audit evidence with continuous scanning. Screenshots, configuration snapshots, and log excerpts are automatically captured and organized by control.",
        icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
        color: "#fca5a5"
      },
      {
        title: "Risk Assessment",
        description: "Automated risk scoring and gap analysis across your security controls. Prioritize remediation efforts based on risk likelihood and business impact with contextualized recommendations.",
        icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
        color: "#dc2626"
      },
      {
        title: "Audit Management",
        description: "Streamline the entire audit process from planning to final reporting. Manage audit schedules, track remediation progress, and generate audit-ready reports with a single click.",
        icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
        color: "#b91c1c"
      },
      {
        title: "Policy Management",
        description: "Create, distribute, and track acknowledgment of security policies. Ensure employees acknowledge policies, track version history, and demonstrate due diligence to auditors.",
        icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z",
        color: "#7f1d1d"
      }
    ],
    useCases: [
      {
        title: "SOC 2 Certification",
        description: "Simplify SOC 2 audits with continuous monitoring and automated evidence collection. Map controls automatically and maintain audit-ready evidence year-round."
      },
      {
        title: "GDPR Compliance",
        description: "Monitor data protection controls and demonstrate compliance with privacy regulations. Track data processing activities, consent management, and breach notification requirements."
      },
      {
        title: "Vendor Risk Management",
        description: "Assess and monitor third-party vendor compliance with your security requirements. Automate vendor questionnaires, track remediation, and maintain vendor security profiles."
      },
      {
        title: "Continuous Auditing",
        description: "Move from point-in-time audits to continuous real-time compliance monitoring. Always be audit-ready with continuous evidence collection and real-time compliance status."
      }
    ],
    architecture: {
      description: "The Compliance platform integrates with your infrastructure to continuously monitor controls, collect evidence, and generate reports for multiple frameworks from a unified dashboard.",
      diagram: (
        <>
          <rect x="280" y="20" width="160" height="60" rx="6" fill="#1e1b4b" stroke="#ef4444" strokeWidth="2" />
          <text x="360" y="55" textAnchor="middle" fill="#fff" fontSize="11">Compliance Engine</text>
          
          <rect x="40" y="120" width="100" height="50" rx="4" fill="#1e1b4b" stroke="#ef4444" strokeWidth="2" />
          <text x="90" y="150" textAnchor="middle" fill="#fff" fontSize="10">SOC 2</text>
          
          <rect x="170" y="120" width="100" height="50" rx="4" fill="#1e1b4b" stroke="#f87171" strokeWidth="2" />
          <text x="220" y="150" textAnchor="middle" fill="#fff" fontSize="10">ISO 27001</text>
          
          <rect x="300" y="120" width="100" height="50" rx="4" fill="#1e1b4b" stroke="#f87171" strokeWidth="2" />
          <text x="350" y="150" textAnchor="middle" fill="#fff" fontSize="10">GDPR</text>
          
          <rect x="430" y="120" width="100" height="50" rx="4" fill="#1e1b4b" stroke="#fca5a5" strokeWidth="2" />
          <text x="480" y="150" textAnchor="middle" fill="#fff" fontSize="10">HIPAA</text>
          
          <rect x="180" y="220" width="160" height="80" rx="6" fill="#1e1b4b" stroke="#ef4444" strokeWidth="2" />
          <text x="260" y="250" textAnchor="middle" fill="#fff" fontSize="11">Evidence Repository</text>
          <text x="260" y="270" textAnchor="middle" fill="#94a3b8" fontSize="9">Automated Collection</text>
          
          <rect x="380" y="220" width="140" height="80" rx="6" fill="#1e1b4b" stroke="#f87171" strokeWidth="2" />
          <text x="450" y="250" textAnchor="middle" fill="#fff" fontSize="11">Audit Reports</text>
          <text x="450" y="270" textAnchor="middle" fill="#94a3b8" fontSize="9">Automated Generation</text>
          
          <path d="M360 80 L90 120" stroke="#ef4444" strokeWidth="1" />
          <path d="M360 80 L220 120" stroke="#ef4444" strokeWidth="1" />
          <path d="M360 80 L350 120" stroke="#ef4444" strokeWidth="1" />
          <path d="M360 80 L480 120" stroke="#ef4444" strokeWidth="1" />
          
          <path d="M90 170 L260 220" stroke="#ef4444" strokeWidth="1" />
          <path d="M220 170 L260 220" stroke="#ef4444" strokeWidth="1" />
          <path d="M350 170 L260 220" stroke="#ef4444" strokeWidth="1" />
          <path d="M480 170 L380 220" stroke="#f87171" strokeWidth="1" />
          
          <path d="M340 260 L380 260" stroke="#f87171" strokeWidth="2" />
        </>
      )
    },
    benefits: [
      { value: "60%", label: "Less Audit Time", description: "Reduce audit preparation time with automated evidence collection." },
      { value: "80%", label: "Faster Remediation", description: "Identify and fix compliance gaps quickly with continuous monitoring." },
      { value: "12+", label: "Frameworks", description: "Support for all major security and privacy compliance frameworks." },
      { value: "Real-time", label: "Visibility", description: "Always know your compliance status with continuous monitoring." }
    ]
  };

  return <ProductPage {...data} />;
}

export default CompliancePage;
