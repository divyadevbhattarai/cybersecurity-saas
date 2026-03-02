import React from "react";
import ProductPage from "./ProductPage";

function CloudSecurityPage() {
  const data = {
    title: "Cloud Security",
    subtitle: "Comprehensive security for AWS, Azure, GCP, and multi-cloud environments with unified visibility and protection.",
    icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z",
    gradient: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
    overview: "CyberShield Cloud Security provides unified visibility and protection across all major cloud providers. Our platform continuously monitors your cloud infrastructure for misconfigurations, identity risks, and compliance violations, providing actionable recommendations to secure your multi-cloud environment. With support for AWS, Azure, GCP, and Kubernetes, you can maintain consistent security policies across your entire cloud footprint.",
    capabilities: [
      {
        title: "CSPM",
        description: "Continuous Security Posture Management to detect and remediate cloud misconfigurations in real-time. Over 200 built-in security checks cover AWS, Azure, GCP, and Kubernetes configurations against industry best practices and compliance standards.",
        icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z",
        color: "#ef4444"
      },
      {
        title: "Cloud Identity Security",
        description: "Monitor IAM configurations, detect privilege escalation, and enforce least privilege principles. Identify overly permissive policies, unused credentials, and risky access patterns that could lead to account compromise.",
        icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
        color: "#f87171"
      },
      {
        title: "Data Protection",
        description: "Discover sensitive data, enforce encryption, and prevent data exfiltration across all cloud storage. Automatically identify PII, PHI, financial data, and intellectual property with data classification and loss prevention capabilities.",
        icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z",
        color: "#fca5a5"
      },
      {
        title: "Network Security",
        description: "Analyze VPC configurations, security groups, and network flows for vulnerabilities. Detect overly permissive rules, exposed services, and unusual network traffic patterns that could indicate a breach.",
        icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z",
        color: "#dc2626"
      },
      {
        title: "Workload Protection",
        description: "Secure containers, serverless functions, and compute instances across cloud platforms. Monitor runtime behavior, detect container escapes, and protect serverless applications from supply chain attacks.",
        icon: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01",
        color: "#b91c1c"
      },
      {
        title: "Compliance Monitoring",
        description: "Automatically map controls to SOC 2, ISO 27001, PCI DSS, HIPAA, GDPR, and more. Maintain continuous compliance with automated evidence collection and real-time policy enforcement.",
        icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
        color: "#7f1d1d"
      }
    ],
    useCases: [
      {
        title: "Multi-Cloud Governance",
        description: "Centralize security across AWS, Azure, and GCP with unified policies and reporting. Apply consistent security controls across all cloud environments from a single dashboard."
      },
      {
        title: "Data Loss Prevention",
        description: "Identify and protect sensitive data like PII, PHI, and financial information in the cloud. Prevent unauthorized access and exfiltration of critical business data."
      },
      {
        title: "DevSecOps Integration",
        description: "Shift security left with pre-deployment checks and infrastructure-as-code scanning. Integrate security into CI/CD pipelines to catch misconfigurations before they reach production."
      },
      {
        title: "Incident Investigation",
        description: "Rapidly investigate security incidents with historical configuration snapshots. Understand what changed, when, and by whom to determine the scope and impact of security events."
      }
    ],
    architecture: {
      description: "The Cloud Security platform integrates with cloud provider APIs to continuously monitor resources, analyze configurations, and provide real-time security insights across your entire multi-cloud infrastructure.",
      diagram: (
        <>
          <rect x="280" y="20" width="120" height="60" rx="6" fill="#1e1b4b" stroke="#ef4444" strokeWidth="2" />
          <text x="340" y="55" textAnchor="middle" fill="#fff" fontSize="11">CyberShield</text>
          
          <rect x="40" y="120" width="100" height="60" rx="6" fill="#1e1b4b" stroke="#ef4444" strokeWidth="2" />
          <text x="90" y="155" textAnchor="middle" fill="#fff" fontSize="11">AWS</text>
          
          <rect x="180" y="120" width="100" height="60" rx="6" fill="#1e1b4b" stroke="#f87171" strokeWidth="2" />
          <text x="230" y="155" textAnchor="middle" fill="#fff" fontSize="11">Azure</text>
          
          <rect x="320" y="120" width="100" height="60" rx="6" fill="#1e1b4b" stroke="#f87171" strokeWidth="2" />
          <text x="370" y="155" textAnchor="middle" fill="#fff" fontSize="11">GCP</text>
          
          <rect x="460" y="120" width="100" height="60" rx="6" fill="#1e1b4b" stroke="#fca5a5" strokeWidth="2" />
          <text x="510" y="155" textAnchor="middle" fill="#fff" fontSize="11">Kubernetes</text>
          
          <rect x="180" y="230" width="140" height="80" rx="6" fill="#1e1b4b" stroke="#ef4444" strokeWidth="2" />
          <text x="250" y="260" textAnchor="middle" fill="#fff" fontSize="11">Security Analysis</text>
          <text x="250" y="280" textAnchor="middle" fill="#94a3b8" fontSize="9">Config Scanning</text>
          
          <rect x="380" y="230" width="120" height="80" rx="6" fill="#1e1b4b" stroke="#f87171" strokeWidth="2" />
          <text x="440" y="260" textAnchor="middle" fill="#fff" fontSize="11">Compliance</text>
          <text x="440" y="280" textAnchor="middle" fill="#94a3b8" fontSize="9">Reporting</text>
          
          <path d="M340 80 L340 120" stroke="#ef4444" strokeWidth="2" />
          <path d="M340 80 L90 120" stroke="#ef4444" strokeWidth="1" />
          <path d="M340 80 L230 120" stroke="#ef4444" strokeWidth="1" />
          <path d="M340 80 L370 120" stroke="#ef4444" strokeWidth="1" />
          <path d="M340 80 L510 120" stroke="#ef4444" strokeWidth="1" />
          
          <path d="M90 180 L250 230" stroke="#ef4444" strokeWidth="2" />
          <path d="M230 180 L250 230" stroke="#ef4444" strokeWidth="2" />
          <path d="M370 180 L250 230" stroke="#ef4444" strokeWidth="2" />
          <path d="M510 180 L440 230" stroke="#f87171" strokeWidth="2" />
          
          <path d="M320 270 L380 270" stroke="#f87171" strokeWidth="2" />
        </>
      )
    },
    benefits: [
      { value: "200+", label: "Security Checks", description: "Industry-leading coverage of cloud security best practices and compliance standards." },
      { value: "80%", label: "Faster Remediation", description: "Automated fixes and guided remediation reduce time to resolve issues." },
      { value: "50+", label: "Integrations", description: "Native connectors for all major cloud services and security tools." },
      { value: "Real-time", label: "Detection", description: "Immediate alerting on misconfigurations and security policy violations." }
    ]
  };

  return <ProductPage {...data} />;
}

export default CloudSecurityPage;
