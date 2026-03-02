import React from "react";
import ProductPage from "./ProductPage";

function SBOMPage() {
  const data = {
    title: "Software Bill of Materials",
    subtitle: "Gain complete visibility into your software supply chain with comprehensive component analysis and continuous monitoring.",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    gradient: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
    overview: "A Software Bill of Materials (SBOM) provides a comprehensive inventory of all components, dependencies, and vulnerabilities in your software supply chain. CyberShield SBOM enables organizations to proactively manage software risks, ensure compliance, and respond quickly to emerging vulnerabilities like Log4j or SolarWinds. By maintaining a complete inventory of all software components, you can instantly determine exposure to new vulnerabilities and prioritize remediation efforts.",
    capabilities: [
      {
        title: "Automated Discovery",
        description: "Automatically discover and catalog all software components including open source libraries, container images, and proprietary code. Continuous scanning identifies new components as they're added to your software portfolio.",
        icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
        color: "#ef4444"
      },
      {
        title: "Vulnerability Tracking",
        description: "Continuously monitor for known vulnerabilities (CVEs) across your entire software inventory. Real-time alerts when new vulnerabilities affect your components, with severity ratings and remediation guidance.",
        icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
        color: "#f87171"
      },
      {
        title: "License Compliance",
        description: "Track open-source licenses and ensure compliance with organizational policies and legal requirements. Identify license conflicts and prevent legal exposure from incompatible licensing terms.",
        icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
        color: "#fca5a5"
      },
      {
        title: "Dependency Analysis",
        description: "Map transitive dependencies and identify vulnerable paths in your software supply chain. Visualize complex dependency trees to understand the full impact of vulnerabilities in nested dependencies.",
        icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
        color: "#dc2626"
      },
      {
        title: "SBOM Generation",
        description: "Generate industry-standard SBOMs in SPDX, CycloneDX, and SWID formats. Export SBOMs for compliance reporting, customer delivery, and regulatory submissions in the format required by your stakeholders.",
        icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12",
        color: "#b91c1c"
      },
      {
        title: "Supply Chain Risk",
        description: "Assess and mitigate risks from third-party components and vendor software. Evaluate supplier security posture, track component provenance, and identify single points of failure in your software supply chain.",
        icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
        color: "#7f1d1d"
      }
    ],
    useCases: [
      {
        title: "Rapid Vulnerability Response",
        description: "Instantly identify which applications are affected by new CVEs and prioritize remediation. When Log4Shell or similar critical vulnerabilities emerge, immediately see your exposure and take action."
      },
      {
        title: "Regulatory Compliance",
        description: "Meet SBOM requirements from NIST, Executive Orders, and industry standards. Generate compliant SBOMs for FDA, PCI-DSS, and other regulatory frameworks that require software transparency."
      },
      {
        title: "DevSecOps Integration",
        description: "Embed SBOM generation into CI/CD pipelines for continuous component monitoring. Gate deployments when vulnerable components are detected and automate remediation workflows."
      },
      {
        title: "M&A Due Diligence",
        description: "Assess software security posture and technical debt during acquisitions. Quickly understand the target company's software inventory, vulnerabilities, and license compliance status."
      }
    ],
    architecture: {
      description: "The SBOM platform integrates with your development pipeline to continuously discover, analyze, and track all software components across the software development lifecycle. The platform maintains a central repository of all SBOMs with powerful search and alerting capabilities.",
      diagram: (
        <>
          <rect x="20" y="160" width="80" height="40" rx="4" fill="#1e1b4b" stroke="#ef4444" strokeWidth="2" />
          <text x="60" y="185" textAnchor="middle" fill="#fff" fontSize="10">Code</text>
          
          <rect x="130" y="160" width="80" height="40" rx="4" fill="#1e1b4b" stroke="#ef4444" strokeWidth="2" />
          <text x="170" y="185" textAnchor="middle" fill="#fff" fontSize="10">Build</text>
          
          <rect x="240" y="140" width="120" height="80" rx="6" fill="#1e1b4b" stroke="#ef4444" strokeWidth="2" />
          <text x="300" y="170" textAnchor="middle" fill="#fff" fontSize="11">SBOM Engine</text>
          <text x="300" y="190" textAnchor="middle" fill="#94a3b8" fontSize="9">Discovery</text>
          
          <rect x="400" y="160" width="80" height="40" rx="4" fill="#1e1b4b" stroke="#f87171" strokeWidth="2" />
          <text x="440" y="185" textAnchor="middle" fill="#fff" fontSize="10">Deploy</text>
          
          <rect x="400" y="220" width="80" height="40" rx="4" fill="#1e1b4b" stroke="#f87171" strokeWidth="2" />
          <text x="440" y="245" textAnchor="middle" fill="#fff" fontSize="10">Runtime</text>
          
          <rect x="520" y="140" width="100" height="120" rx="6" fill="#1e1b4b" stroke="#fca5a5" strokeWidth="2" />
          <text x="570" y="165" textAnchor="middle" fill="#fff" fontSize="10">SBOM</text>
          <text x="570" y="180" textAnchor="middle" fill="#fff" fontSize="10">Repository</text>
          <text x="570" y="210" textAnchor="middle" fill="#94a3b8" fontSize="9">SPDX</text>
          <text x="570" y="225" textAnchor="middle" fill="#94a3b8" fontSize="9">CycloneDX</text>
          <text x="570" y="240" textAnchor="middle" fill="#94a3b8" fontSize="9">SWID</text>
          
          <path d="M100 180 L130 180" stroke="#ef4444" strokeWidth="2" />
          <path d="M210 180 L240 180" stroke="#ef4444" strokeWidth="2" />
          <path d="M360 180 L400 180" stroke="#f87171" strokeWidth="2" />
          <path d="M300 220 L300 240 L400 240" stroke="#f87171" strokeWidth="2" />
          <path d="M480 200 L520 200" stroke="#fca5a5" strokeWidth="2" />
          
          <circle cx="300" cy="80" r="30" fill="none" stroke="#ef4444" strokeWidth="2">
            <animate attributeName="r" values="30;35;30" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x="300" y="85" textAnchor="middle" fill="#fff" fontSize="9">Vulnerability</text>
          <text x="300" y="97" textAnchor="middle" fill="#fff" fontSize="9">Database</text>
          <path d="M300 110 L300 140" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" />
        </>
      )
    },
    benefits: [
      { value: "95%", label: "Faster CVE Response", description: "Identify affected components in minutes instead of days." },
      { value: "100%", label: "Visibility", description: "Complete picture of software inventory including transitive dependencies." },
      { value: "70%", label: "Compliance Cost", description: "Reduce time and effort for regulatory audits and assessments." },
      { value: "Zero", label: "Surprises", description: "Proactive awareness of vulnerabilities before they're exploited." }
    ]
  };

  return <ProductPage {...data} />;
}

export default SBOMPage;
