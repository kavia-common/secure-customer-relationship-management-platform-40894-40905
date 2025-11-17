import React from "react";

/**
 * PUBLIC_INTERFACE
 * DonutChart uses CSS conic-gradient. value = 0..100
 */
export default function DonutChart({ value = 0, label = "Completion" }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="card pad-6" aria-label={`${label} ${pct}%`}>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div className="donut" style={{ "--value": `${pct}%` }}>
          <div className="center">{pct}%</div>
        </div>
        <div>
          <div style={{ fontWeight: 700 }}>{label}</div>
          <div className="text-muted">Distribution of closed vs open this period</div>
        </div>
      </div>
    </div>
  );
}
