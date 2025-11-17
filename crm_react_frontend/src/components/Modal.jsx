import React from "react";

/**
 * PUBLIC_INTERFACE
 * Modal with backdrop
 */
export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title || "Dialog"} onClick={(e) => {
      if (e.target === e.currentTarget) onClose && onClose();
    }}>
      <div className="modal">
        {title && <div className="card-header">{title}</div>}
        <div className="card-body">{children}</div>
        <div className="pad-4" style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button className="btn ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
