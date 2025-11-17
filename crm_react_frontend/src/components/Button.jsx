import React from "react";

/**
 * PUBLIC_INTERFACE
 * Button - basic button with variants
 */
export default function Button({ children, variant = "primary", ...rest }) {
  return (
    <button className={`btn ${variant}`} {...rest}>
      {children}
    </button>
  );
}
