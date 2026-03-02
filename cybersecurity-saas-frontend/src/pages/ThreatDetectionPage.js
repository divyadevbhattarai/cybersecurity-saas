import React from "react";
import ProductPage from "./ProductPage";

function ThreatDetectionPage() {
  const data = {
    title: "AI-Powered Threat Detection",
    subtitle: "Detect sophisticated attacks in real-time using advanced machine learning and behavioral analysis.",
    icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
    gradient: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
    overview: "Our AI-powered threat detection system uses advanced machine learning algorithms to identify both known and unknown threats in real-time. By analyzing millions of signals across your infrastructure, we can detect sophisticated attacks that traditional signature-based systems miss, including zero-day exploits, insider threats, and advanced persistent threats. The system continuously learns from your environment, adapting to your unique infrastructure and user behavior patterns.",
    capabilities: [
      {
        title: "Behavioral Analysis",
        description: "Learn normal patterns for users, devices, and applications to detect anomalous behavior. Build dynamic baselines of expected behavior and flag deviations that could indicate a security threat or compromised account.",
        icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
        color: "#ef4444"
      },
      {
        title: "Anomaly Detection",
        description: "Identify unusual patterns that may indicate a security threat using ML models. Detect deviations from baseline behavior, unusual data access patterns, and abnormal network traffic without relying on predefined signatures.",
        icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
        color: "#f87171"
      },
      {
        title: "Threat Intelligence",
        description: "Enrich alerts with global threat intelligence from multiple sources. Correlate detected indicators against millions of known threat indicators, threat actor profiles, and emerging campaign intelligence.",
        icon: "M13 10V3L4 14h7v7l9-11h-7z",
        color: "#fca5a5"
      },
      {
        title: "UEBA",
        description: "User and Entity Behavior Analytics to detect insider threats and compromised accounts. Analyze user behavior across endpoints, cloud services, and applications to identify malicious activity or credential theft.",
        icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
        color: "#dc2626"
      },
      {
        title: "Cloud-native Detection",
        description: "Detect threats specific to cloud environments including misconfigurations, lateral movement, and unauthorized access. Monitor cloud API calls, container behavior, and serverless function execution for suspicious activity.",
        icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z",
        color: "#b91c1c"
      },
      {
        title: "IOC Correlation",
        description: "Correlate indicators of compromise across multiple data sources for comprehensive detection. Link related alerts, identify attack chains, and prioritize threats based on their potential impact.",
        icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
        color: "#7f1d1d"
      }
    ],
    useCases: [
      {
        title: "Zero-Day Detection",
        description: "Identify previously unknown attacks by detecting anomalous behavior patterns. Machine learning models can identify novel attack techniques without prior knowledge of specific signatures."
      },
      {
        title: "Insider Threat Detection",
        description: "Detect malicious or negligent insider activity before data exfiltration occurs. Monitor for unusual data access, privilege abuse, and policy violations by employees and contractors."
      },
      {
        title: "Account Compromise",
        description: "Identify compromised credentials and account takeover attempts in real-time. Detect anomalous login patterns, impossible travel, and unusual activity following credential theft."
      },
      {
        title: "Lateral Movement",
        description: "Detect attackers moving through your network after initial compromise. Identify suspicious service account usage, privileged escalation, and replication activities."
      }
    ],
    architecture: {
      description: "The threat detection system collects signals from across your infrastructure, applies ML models for analysis, and provides real-time alerting with contextual information to accelerate incident response.",
      diagram: (
        <>
          <rect x="20" y="160" width="80" height="40" rx="4" fill="#1e1b4b" stroke="#ef4444" strokeWidth="2" />
          <text x="60" y="185" textAnchor="middle" fill="#fff" fontSize="10">Endpoints</text>
          
          <rect x="130" y="160" width="80" height="40" rx="4" fill="#1e1b4b" stroke="#f87171" strokeWidth="2" />
          <text x="170" y="185" textAnchor="middle" fill="#fff" fontSize="10">Network</text>
          
          <rect x="240" y="160" width="80" height="40" rx="4" fill="#1e1b4b" stroke="#f87171" strokeWidth="2" />
          <text x="280" y="185" textAnchor="middle" fill="#fff" fontSize="10">Cloud</text>
          
          <rect x="350" y="160" width="80" height="40" rx="4" fill="#1e1b4b" stroke="#fca5a5" strokeWidth="2" />
          <text x="390" y="185" textAnchor="middle" fill="#fff" fontSize="10">Identity</text>
          
          <rect x="280" y="80" width="160" height="70" rx="6" fill="#1e1b4b" stroke="#ef4444" strokeWidth="2" />
          <text x="360" y="110" textAnchor="middle" fill="#fff" fontSize="11">ML Engine</text>
          <text x="360" y="128" textAnchor="middle" fill="#94a3b8" fontSize="9">Behavioral Models</text>
          
          <rect x="280" y="240" width="160" height="70" rx="6" fill="#1e1b4b" stroke="#ef4444" strokeWidth="2" />
          <text x="360" y="270" textAnchor="middle" fill="#fff" fontSize="11">Alert Engine</text>
          <text x="360" y="288" textAnchor="middle" fill="#94a3b8" fontSize="9">Real-time Processing</text>
          
          <rect x="500" y="240" width="80" height="70" rx="6" fill="#1e1b4b" stroke="#f87171" strokeWidth="2" />
          <text x="540" y="280" textAnchor="middle" fill="#fff" fontSize="10">SIEM</text>
          
          <path d="M60 160 L60 150 L360 150 L360 80" stroke="#ef4444" strokeWidth="1" />
          <path d="M170 160 L170 150 L360 150" stroke="#f87171" strokeWidth="1" />
          <path d="M280 160 L280 150 L360 150" stroke="#f87171" strokeWidth="1" />
          <path d="M390 160 L390 150 L360 150" stroke="#fca5a5" strokeWidth="1" />
          
          <path d="M360 150 L360 240" stroke="#ef4444" strokeWidth="2" />
          <path d="M440 275 L500 275" stroke="#f87171" strokeWidth="2" />
        </>
      )
    },
    benefits: [
      { value: "95%", label: "Detection Rate", description: "Industry-leading detection accuracy with minimal false positives." },
      { value: "<5s", label: "Detection Time", description: "Near real-time threat detection and alerting." },
      { value: "Zero-day", label: "Protection", description: "Detect unknown threats through behavioral analysis." },
      { value: "80%", label: "Noise Reduction", description: "Prioritize alerts with automated correlation and scoring." }
    ]
  };

  return <ProductPage {...data} />;
}

export default ThreatDetectionPage;
