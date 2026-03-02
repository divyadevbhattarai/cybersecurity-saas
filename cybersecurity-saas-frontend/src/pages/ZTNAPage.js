import React from "react";
import ProductPage from "./ProductPage";

function ZTNAPage() {
  const data = {
    title: "Zero Trust Network Access",
    subtitle: "Never trust, always verify. Implement identity-based access control for your entire infrastructure with enterprise-grade security.",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    gradient: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
    overview: "Zero Trust Network Access (ZTNA) is a security framework that requires all users, whether inside or outside the organization's network, to be authenticated, authorized, and continuously validated before being granted access to applications and data. Unlike traditional VPN solutions that create a network perimeter, ZTNA assumes that trust is never implicit and verifies every request. CyberShield ZTNA provides identity-based access control that works seamlessly across cloud, on-premise, and hybrid environments, ensuring consistent security policies regardless of where users connect from.",
    capabilities: [
      {
        title: "Identity-Based Access",
        description: "Grant access based on user identity, device posture, and context rather than network location. Integrate with your existing identity providers including Azure AD, Okta, Ping Identity, and more for seamless authentication workflows.",
        icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
        color: "#ef4444"
      },
      {
        title: "Micro-Segmentation",
        description: "Create granular security segments to isolate workloads and limit lateral movement. Define fine-grained policies that control communication between specific workloads, reducing the attack surface and containing breaches.",
        icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
        color: "#f87171"
      },
      {
        title: "Just-In-Time Access",
        description: "Provide temporary, time-limited access to critical resources only when needed. Users request access for specific durations, and access automatically revokes when the time expires, minimizing exposure.",
        icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
        color: "#fca5a5"
      },
      {
        title: "Biometric Integration",
        description: "Support fingerprint, facial recognition, iris scan, and voice recognition for strong multi-factor authentication. Hardware-backed biometric verification ensures user authenticity without password dependencies.",
        icon: "M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.858.567-4.163",
        color: "#dc2626"
      },
      {
        title: "Device Posture Check",
        description: "Evaluate device security status before granting access, ensuring compliance with policies. Check for up-to-date antivirus, encryption status, OS version, and MDM enrollment before allowing access.",
        icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z",
        color: "#b91c1c"
      },
      {
        title: "Web3 Identity Support",
        description: "Integrate blockchain-based identity for decentralized authentication workflows. Support wallet-based authentication for Web3 applications and NFT-gated access controls.",
        icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
        color: "#7f1d1d"
      }
    ],
    useCases: [
      {
        title: "Remote Workforce Security",
        description: "Enable secure access for remote employees without relying on traditional VPNs, reducing attack surface while improving user experience. Employees can securely access corporate applications from any location using any device."
      },
      {
        title: "Third-Party Access Management",
        description: "Provide controlled, time-limited access to vendors and contractors with full audit trails and compliance monitoring. Set specific access windows, limit resource access, and maintain complete visibility into all external access attempts."
      },
      {
        title: "Cloud Migration",
        description: "Secure access to cloud workloads while maintaining consistent security policies across hybrid environments. Migrate from legacy VPNs to ZTNA without disrupting user productivity or compromising security."
      },
      {
        title: "M&A Integration",
        description: "Quickly onboard new entities with appropriate access controls while maintaining network isolation during integration. Apply consistent identity and access policies across acquired organizations."
      }
    ],
    architecture: {
      description: "The ZTNA architecture creates a logical identity-aware proxy that sits between users and resources, enforcing access policies based on identity, device posture, and contextual factors. All traffic flows through the ZTNA controller, which validates credentials and applies policies before allowing connections.",
      diagram: (
        <>
          <rect x="50" y="150" width="120" height="60" rx="8" fill="#1e1b4b" stroke="#ef4444" strokeWidth="2" />
          <text x="110" y="185" textAnchor="middle" fill="#fff" fontSize="12">User Device</text>
          
          <rect x="250" y="120" width="140" height="80" rx="8" fill="#1e1b4b" stroke="#ef4444" strokeWidth="2" />
          <text x="320" y="155" textAnchor="middle" fill="#fff" fontSize="12">ZTNA Controller</text>
          <text x="320" y="175" textAnchor="middle" fill="#94a3b8" fontSize="10">Policy Engine</text>
          
          <rect x="470" y="150" width="120" height="60" rx="8" fill="#1e1b4b" stroke="#f87171" strokeWidth="2" />
          <text x="530" y="185" textAnchor="middle" fill="#fff" fontSize="12">Cloud Apps</text>
          
          <rect x="470" y="250" width="120" height="60" rx="8" fill="#1e1b4b" stroke="#f87171" strokeWidth="2" />
          <text x="530" y="285" textAnchor="middle" fill="#fff" fontSize="12">On-Premise</text>
          
          <path d="M170 180 L250 160" stroke="#ef4444" strokeWidth="2" strokeDasharray="5 5">
            <animate attributeName="stroke-dashoffset" values="0;-10" dur="1s" repeatCount="indefinite" />
          </path>
          <path d="M390 160 L470 180" stroke="#f87171" strokeWidth="2" strokeDasharray="5 5">
            <animate attributeName="stroke-dashoffset" values="0;-10" dur="1s" repeatCount="indefinite" />
          </path>
          <path d="M320 200 L320 250" stroke="#f87171" strokeWidth="2" strokeDasharray="5 5" />
          
          <circle cx="320" cy="100" r="30" fill="none" stroke="#ef4444" strokeWidth="2">
            <animate attributeName="r" values="30;35;30" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x="320" y="105" textAnchor="middle" fill="#fff" fontSize="10">Identity</text>
        </>
      )
    },
    benefits: [
      { value: "85%", label: "Reduced Attack Surface", description: "Minimize exposure by eliminating implicit trust and network-based access." },
      { value: "60%", label: "Faster Incident Response", description: "Isolate threats quickly with micro-segmentation and automated policies." },
      { value: "99.9%", label: "Uptime SLA", description: "Enterprise-grade reliability with global distribution and failover." },
      { value: "40%", label: "Lower TCO", description: "Reduce infrastructure costs compared to traditional VPN solutions." }
    ]
  };

  return <ProductPage {...data} />;
}

export default ZTNAPage;
