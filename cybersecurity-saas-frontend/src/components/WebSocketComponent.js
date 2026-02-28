import React, { useEffect, useRef, useState } from "react";

const WebSocketComponent = () => {
  const [status, setStatus] = useState("disconnected");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connectWebSocket = () => {
    const wsUrl = process.env.REACT_APP_WS_URL
      ? `${process.env.REACT_APP_WS_URL}/anomaly_alerts/`
      : "ws://localhost:8000/ws/anomaly_alerts/";

    const token = localStorage.getItem("access_token");
    const url = token ? `${wsUrl}?token=${token}` : wsUrl;

    try {
      socketRef.current = new WebSocket(url);

      socketRef.current.onopen = () => {
        console.log("WebSocket connected");
        setStatus("connected");
        reconnectAttempts.current = 0;
      };

      socketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.alert) {
            const newMessage = {
              id: Date.now(),
              text: data.alert,
              timestamp: new Date().toLocaleTimeString(),
            };
            setMessages((prev) => [newMessage, ...prev].slice(0, 10));
          }
        } catch (e) {
          console.error("Failed to parse WebSocket message:", e);
        }
      };

      socketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setStatus("error");
      };

      socketRef.current.onclose = () => {
        console.log("WebSocket disconnected");
        setStatus("disconnected");

        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current += 1;
          console.log(`Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})...`);
          setTimeout(connectWebSocket, 3000 * reconnectAttempts.current);
        }
      };
    } catch (error) {
      console.error("WebSocket connection error:", error);
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <div className="websocket-container">
      <div className={`ws-status ${status}`}>
        <span className="ws-indicator"></span>
        {status === "connected" ? "Connected - Receiving Real-Time Alerts" : "Disconnected - Reconnecting..."}
      </div>

      <div className="ws-messages">
        {messages.length === 0 ? (
          <p className="empty-state">
            {status === "connected"
              ? "Waiting for alerts..."
              : "Connect to receive real-time threat alerts"}
          </p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="ws-message">
              <span className="ws-time">{msg.timestamp}</span>
              <p>{msg.text}</p>
            </div>
          ))
        )}
      </div>

      <style>{`
        .websocket-container {
          padding: 10px;
        }
        .ws-status {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 15px;
        }
        .ws-status.connected {
          background: #d1fae5;
          color: #059669;
        }
        .ws-status.disconnected {
          background: #fee2e2;
          color: #dc2626;
        }
        .ws-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: currentColor;
        }
        .ws-status.connected .ws-indicator {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .ws-messages {
          max-height: 300px;
          overflow-y: auto;
        }
        .ws-message {
          padding: 12px;
          background: #fef3c7;
          border-left: 3px solid #f59e0b;
          border-radius: var(--radius-sm);
          margin-bottom: 8px;
        }
        .ws-time {
          font-size: 11px;
          color: #92400e;
        }
        .ws-message p {
          margin: 4px 0 0;
          font-size: 13px;
          color: #92400e;
        }
      `}</style>
    </div>
  );
};

export default WebSocketComponent;
