import React, { useState, useEffect } from "react";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-content">
        <p>
          We use cookies to enhance your browsing experience, serve personalized content, 
          and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
        </p>
        <div className="cookie-actions">
          <button onClick={handleAccept} className="btn btn-primary btn-sm">
            Accept
          </button>
          <button onClick={handleDecline} className="btn btn-outline btn-sm">
            Decline
          </button>
        </div>
      </div>
      <style>{`
        .cookie-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--gray-800);
          border-top: 1px solid var(--gray-700);
          padding: 16px 24px;
          z-index: 9999;
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .cookie-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }
        .cookie-content p {
          color: var(--gray-300);
          font-size: 14px;
          margin: 0;
          flex: 1;
          min-width: 280px;
        }
        .cookie-actions {
          display: flex;
          gap: 12px;
        }
        .btn-sm {
          padding: 8px 16px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default CookieConsent;
