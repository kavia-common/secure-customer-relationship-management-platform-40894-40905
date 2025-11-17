import React from "react";

/**
 * PUBLIC_INTERFACE
 * KPICard highlights a metric with subtitle and optional sparkline
 */
export default function KPICard({ label, value, change, changeLabel, sparkPercent = 0 }) {
  return (
    <div className="card pad-4" aria-label={`${label} KPI`}>
      <div className="text-muted" style={{ fontSize: 12 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>{value}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
        <span className={change >= 0 ? "text-success" : "text-error"}>{change >= 0 ? "▲" : "▼"} {Math.abs(change)}%</span>
        <span className="text-muted">{changeLabel}</span>
      </div>
      <div className="sparkline mt-4" style={{ "--p": `${sparkPercent}%` }} />
    </div>
  );
}
