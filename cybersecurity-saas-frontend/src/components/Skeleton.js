import React from 'react';

function Skeleton({ width, height, borderRadius = '4px', className = '' }) {
  return (
    <div 
      className={`skeleton ${className}`}
      style={{
        width: width || '100%',
        height: height || '20px',
        borderRadius,
      }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card" role="status" aria-label="Loading content">
      <Skeleton height="24px" width="60%" />
      <Skeleton height="16px" width="40%" />
      <Skeleton height="100px" />
      <div className="skeleton-actions">
        <Skeleton width="100px" height="36px" borderRadius="4px" />
        <Skeleton width="100px" height="36px" borderRadius="4px" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="skeleton-table" role="status" aria-label="Loading table">
      <div className="skeleton-table-header">
        <Skeleton height="20px" width="20%" />
        <Skeleton height="20px" width="20%" />
        <Skeleton height="20px" width="20%" />
        <Skeleton height="20px" width="20%" />
        <Skeleton height="20px" width="15%" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-table-row">
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="skeleton-stats" role="status" aria-label="Loading statistics">
      <Skeleton height="120px" borderRadius="8px" />
      <Skeleton height="120px" borderRadius="8px" />
      <Skeleton height="120px" borderRadius="8px" />
      <Skeleton height="120px" borderRadius="8px" />
    </div>
  );
}

export default Skeleton;
