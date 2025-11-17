import React from "react";
import { Link } from "../router/HashRouter";

function isActive(href) {
  const hash = window.location.hash.replace(/^#/, "") || "/";
  if (href === "/") return hash === "/";
  return hash.startsWith(href);
}

/**
 * PUBLIC_INTERFACE
 * Sidebar renders primary navigation.
 */
export default function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Primary">
      <div className="brand" aria-label="CRM">
        <span aria-hidden="true">🏛️</span>
        <span>Heritage CRM</span>
      </div>
      <nav className="nav">
        <Link className={isActive("/") ? "active" : ""} aria-current={isActive("/") ? "page" : undefined} to="/">Dashboard</Link>
        <Link className={isActive("/customers") ? "active" : ""} aria-current={isActive("/customers") ? "page" : undefined} to="/customers">Customers</Link>
        <Link className={isActive("/requests") ? "active" : ""} aria-current={isActive("/requests") ? "page" : undefined} to="/requests">Service Requests</Link>
        <Link className={isActive("/complaints") ? "active" : ""} aria-current={isActive("/complaints") ? "page" : undefined} to="/complaints">Complaints</Link>
        <Link className={isActive("/reports") ? "active" : ""} aria-current={isActive("/reports") ? "page" : undefined} to="/reports">Reports</Link>
        <Link className={isActive("/analytics") ? "active" : ""} aria-current={isActive("/analytics") ? "page" : undefined} to="/analytics">Analytics</Link>
        <Link className={isActive("/audit") ? "active" : ""} aria-current={isActive("/audit") ? "page" : undefined} to="/audit">Audit</Link>
        <Link className={isActive("/settings") ? "active" : ""} aria-current={isActive("/settings") ? "page" : undefined} to="/settings">Settings</Link>
      </nav>
    </aside>
  );
}
