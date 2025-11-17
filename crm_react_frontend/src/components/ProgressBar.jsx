import React from "react";

/**
 * PUBLIC_INTERFACE
 * ProgressBar displays percent
 */
export default function ProgressBar({ value = 0 }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div aria-label={`Progress ${pct}%`} style={{ width: "100%", background: "#F3F4F6", borderRadius: 8, height: 10 }}>
      <div style={{ width: `${pct}%`, height: "100%", borderRadius: 8, background: "linear-gradient(90deg, #92400E, #D97706)" }} />
    </div>
  );
}
