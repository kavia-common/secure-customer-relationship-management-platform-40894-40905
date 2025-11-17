import React from "react";

/**
 * PUBLIC_INTERFACE
 * Input with label and hint
 */
export function Input({ label, hint, ...rest }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span>{label}</span>
      <input className="input" {...rest} />
      {hint && <span className="text-muted" style={{ fontSize: 12 }}>{hint}</span>}
    </label>
  );
}

/**
 * PUBLIC_INTERFACE
 * Select with label
 */
export function Select({ label, children, ...rest }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span>{label}</span>
      <select className="select" {...rest}>
        {children}
      </select>
    </label>
  );
}
