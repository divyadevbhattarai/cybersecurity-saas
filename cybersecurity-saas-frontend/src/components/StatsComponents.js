import React from 'react';

export function StatsCard({ title, value, icon, color = '#4f46e5', trend, trendValue }) {
  return (
    <div className="stat-card" role="region" aria-label={`${title}: ${value}`}>
      <div className="stat-icon" style={{ background: `${color}15` }}>
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <path d={icon} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="stat-content">
        <h3>{value}</h3>
        <p>{title}</p>
        {trend && (
          <span className={`stat-trend ${trend}`}>
            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
              {trend === 'up' ? (
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              )}
            </svg>
            {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}

export function MiniChart({ data, color = '#4f46e5', type = 'bar' }) {
  const max = Math.max(...data, 1);
  
  if (type === 'bar') {
    return (
      <div className="mini-chart" role="img" aria-label="Bar chart">
        <div className="mini-chart-bars">
          {data.map((value, index) => (
            <div 
              key={index} 
              className="mini-chart-bar"
              style={{ 
                height: `${(value / max) * 100}%`,
                backgroundColor: color
              }}
            >
              <span className="sr-only">{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return null;
}

export function ProgressRing({ progress, size = 60, strokeWidth = 6, color = '#4f46e5' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  
  return (
    <div className="progress-ring" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
      <svg width={size} height={size}>
        <circle
          stroke="#374151"
          fill="none"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={color}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <span className="progress-ring-text">{progress}%</span>
    </div>
  );
}

export function ThreatLevelIndicator({ level = 'low' }) {
  const levels = {
    low: { color: '#34d399', label: 'Low', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    medium: { color: '#fbbf24', label: 'Medium', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    high: { color: '#f87171', label: 'High', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    critical: { color: '#dc2626', label: 'Critical', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  };
  
  const current = levels[level] || levels.low;
  
  return (
    <div className="threat-level" role="status" aria-label={`Threat level: ${current.label}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke={current.color} strokeWidth="2">
        <path d={current.icon} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ color: current.color }}>{current.label}</span>
    </div>
  );
}

export default StatsCard;
