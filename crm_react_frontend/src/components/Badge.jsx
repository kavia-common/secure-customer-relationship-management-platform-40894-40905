import React from "react";

/**
 * PUBLIC_INTERFACE
 * Badge supports variants: success, error, warning, info
 */
export default function Badge({ children, variant = "info" }) {
  return <span className={`badge ${variant}`}>{children}</span>;
}
