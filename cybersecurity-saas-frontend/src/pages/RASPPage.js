import React from "react";
import ProductPage from "./ProductPage";

function RASPPage() {
  const data = {
    title: "Runtime Application Self-Protection",
    subtitle: "Protect applications in production with real-time threat detection and self-healing capabilities.",
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    gradient: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
    overview: "Runtime Application Self-Protection (RASP) is a security technology that monitors application behavior and protects against attacks in real-time by embedding security directly into the application runtime. Unlike WAFs that analyze traffic at the perimeter, RASP works inside the application, understanding context and preventing attacks without manual intervention. CyberShield RASP provides comprehensive protection for web applications, APIs, and microservices with minimal performance impact and zero downtime deployments.",
    capabilities: [
      {
        title: "Real-Time Protection",
        description: "Detect and block attacks as they happen, including SQL injection, XSS, zero-day exploits, and command injection. RASP intercepts attacks at the application level, understanding the context of each request and blocking only malicious behavior.",
        icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11-1.042.622 0-.133-2.052-.382-3.016z",
        color: "#ef4444"
      },
      {
        title: "Self-Healing",
        description: "Automatically patch vulnerabilities and neutralize attacks without service interruption. RASP can neutralize malicious inputs, block exploitation attempts, and restore application state without requiring code changes or redeployment.",
        icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
        color: "#f87171"
      },
      {
        title: "Behavioral Analysis",
        description: "Learn normal application behavior and detect anomalies that indicate attacks. Build dynamic models of expected application behavior and flag deviations that could indicate security threats.",
        icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
        color: "#fca5a5"
      },
      {
        title: "Virtual Patching",
        description: "Deploy immediate protections for known vulnerabilities without code changes. When a new CVE is disclosed, apply virtual patches instantly across all protected applications without waiting for development cycles.",
        icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        color: "#dc2626"
      },
      {
        title: "Attack Forensics",
        description: "Capture detailed attack data including payloads, stack traces, and attack chains. Record complete details of every blocked attack for post-incident analysis and threat intelligence gathering.",
        icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
        color: "#b91c1c"
      },
      {
        title: "Code-Level Visibility",
        description: "See exactly which line of code is being exploited with full runtime instrumentation. Pinpoint vulnerability locations and understand attack vectors with detailed execution flow analysis.",
        icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
        color: "#7f1d1d"
      }
    ],
    useCases: [
      {
        title: "API Protection",
        description: "Secure APIs from injection attacks, parameter tampering, and abuse with deep inspection. Protect REST and GraphQL APIs with schema validation, rate limiting, and attack blocking."
      },
      {
        title: "Legacy App Security",
        description: "Add modern protection to older applications without rewriting code or interrupting operations. Deploy RASP agents to instantly secure applications running on end-of-life frameworks."
      },
      {
        title: "Microservices Defense",
        description: "Protect containerized microservices with lightweight agents and service mesh integration. Secure Kubernetes workloads with automatic deployment and centralized policy management."
      },
      {
        title: "Third-Party Code Safety",
        description: "Monitor and protect against vulnerabilities in open-source libraries and dependencies. Detect and block exploitation of known vulnerabilities in third-party components."
      }
    ],
    architecture: {
      description: "RASP technology integrates directly into the application runtime, monitoring all execution and blocking malicious behavior in real-time without external dependencies. The agent instruments the application at load time, providing protection without network appliances or external proxies.",
      diagram: (
        <>
          <rect x="20" y="140" width="80" height="60" rx="6" fill="#1e1b4b" stroke="#ef4444" strokeWidth="2" />
          <text x="60" y="175" textAnchor="middle" fill="#fff" fontSize="10">Request</text>
          
          <rect x="140" y="100" width="120" height="80" rx="6" fill="#1e1b4b" stroke="#ef4444" strokeWidth="2" />
          <text x="200" y="135" textAnchor="middle" fill="#fff" fontSize="11">RASP Agent</text>
          <text x="200" y="155" textAnchor="middle" fill="#94a3b8" fontSize="9">Instrumentation</text>
          
          <rect x="300" y="100" width="100" height="80" rx="6" fill="#1e1b4b" stroke="#f87171" strokeWidth="2" />
          <text x="350" y="145" textAnchor="middle" fill="#fff" fontSize="11">Application</text>
          
          <rect x="300" y="220" width="100" height="60" rx="6" fill="#1e1b4b" stroke="#f87171" strokeWidth="2" />
          <text x="350" y="255" textAnchor="middle" fill="#fff" fontSize="10">Database</text>
          
          <rect x="440" y="140" width="80" height="60" rx="6" fill="#1e1b4b" stroke="#fca5a5" strokeWidth="2" />
          <text x="480" y="175" textAnchor="middle" fill="#fff" fontSize="10">Response</text>
          
          <path d="M100 170 L140 140" stroke="#ef4444" strokeWidth="2" />
          <path d="M260 140 L300 140" stroke="#ef4444" strokeWidth="2" />
          <path d="M350 180 L350 220" stroke="#f87171" strokeWidth="2" />
          <path d="M400 170 L440 170" stroke="#fca5a5" strokeWidth="2" />
          
          <circle cx="200" cy="60" r="25" fill="none" stroke="#ef4444" strokeWidth="2">
            <animate attributeName="r" values="25;30;25" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x="200" y="65" textAnchor="middle" fill="#fff" fontSize="9">Policy Engine</text>
          <path d="M200 85 L200 100" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" />
          
          <rect x="520" y="120" width="80" height="100" rx="6" fill="#1e1b4b" stroke="#fca5a5" strokeWidth="2" />
          <text x="560" y="155" textAnchor="middle" fill="#fff" fontSize="9">Security</text>
          <text x="560" y="170" textAnchor="middle" fill="#fff" fontSize="9">Dashboard</text>
          <path d="M480 170 L520 170" stroke="#fca5a5" strokeWidth="1" strokeDasharray="3 3" />
        </>
      )
    },
    benefits: [
      { value: "99%", label: "Attack Detection", description: "Block even unknown attacks with behavioral analysis and context-aware protection." },
      { value: "Near-Zero", label: "False Positives", description: "Minimize disruption with precise, application-contextual threat blocking." },
      { value: "Zero", label: "Downtime Patching", description: "Deploy virtual patches instantly without taking applications offline." },
      { value: "100%", label: "Code Coverage", description: "Protect every code path including dynamically generated and obfuscated code." }
    ]
  };

  return <ProductPage {...data} />;
}

export default RASPPage;
