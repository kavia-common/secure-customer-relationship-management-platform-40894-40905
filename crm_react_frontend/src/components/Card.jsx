import React from "react";

/**
 * PUBLIC_INTERFACE
 * Card with optional header
 */
export default function Card({ title, children, footer, headerRight }) {
  return (
    <div className="card">
      {title && (
        <div className="card-header">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{title}</span>
            {headerRight}
          </div>
        </div>
      )}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer pad-4">{footer}</div>}
    </div>
  );
}
