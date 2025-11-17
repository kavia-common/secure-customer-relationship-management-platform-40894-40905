import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "../router/HashRouter";
import { useApp } from "../state/AppContext";

function getHashPath() {
  const h = window.location.hash || "#/";
  const raw = h.startsWith("#") ? h.slice(1) : h;
  const [pathnameOnly] = raw.split("?");
  return pathnameOnly || "/";
}

function isActivePath(current, href) {
  if (href === "/") return current === "/";
  // ensure segment boundary match to avoid "/requests" matching "/requests-new"
  return current === href || current.startsWith(href + "/");
}

function Icon({ name }) {
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", "aria-hidden": "true" };
  switch (name) {
    case "dashboard":
      return (
        <svg {...common}><path fill="currentColor" d="M3 3h8v8H3V3zm10 0h8v5h-8V3zM3 13h5v8H3v-8zm7 4h11v4H10v-4z"/></svg>
      );
    case "customers":
      return (
        <svg {...common}><path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h10v-2.5C11 14.17 6.33 13 4 13zm12 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.98 1.97 3.45V19h4v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
      );
    case "requests":
      return (
        <svg {...common}><path fill="currentColor" d="M7 2h10a2 2 0 0 1 2 2v14l-5-3-5 3V4a2 2 0 0 1 2-2z"/></svg>
      );
    case "workflows":
      return (
        <svg {...common}><path fill="currentColor" d="M4 4h6v6H4V4zm0 10h6v6H4v-6zm10-5h6v6h-6V9zm-5 2h4v2H9v-2zm9 6h2v4h-2v-4zM9 5h4v2H9V5z"/></svg>
      );
    case "inbox":
      return (
        <svg {...common}><path fill="currentColor" d="M19 3H4.99C3.88 3 3 3.9 3 5l.01 14c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12h-4a2 2 0 0 1-4 0H4.99V5H19v10z"/></svg>
      );
    case "reports":
      return (
        <svg {...common}><path fill="currentColor" d="M3 13h4v8H3v-8zm6-6h4v14H9V7zm6 3h4v11h-4V10z"/></svg>
      );
    case "admin":
      return (
        <svg {...common}><path fill="currentColor" d="M12 1l9 4v6c0 5-3.8 9.7-9 11-5.2-1.3-9-6-9-11V5l9-4zm0 6a3 3 0 100 6 3 3 0 000-6z"/></svg>
      );
    case "complaints":
      return (
        <svg {...common}><path fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14h-2v-2h2v2zm0-4h-2V6h2v6z"/></svg>
      );
    case "settings":
      return (
        <svg {...common}><path fill="currentColor" d="M19.14 12.94a7.97 7.97 0 000-1.88l2.03-1.58-1.92-3.32-2.39.96a8.06 8.06 0 00-1.63-.94L14.6 2h-3.2l-.64 3.18a8.06 8.06 0 00-1.63.94l-2.39-.96-1.92 3.32 2.03 1.58a7.97 7.97 0 000 1.88l-2.03 1.58 1.92 3.32 2.39-.96c.5.38 1.05.7 1.63.94L11.4 22h3.2l.64-3.18c.58-.24 1.13-.56 1.63-.94l2.39.96 1.92-3.32-2.03-1.58zM12 15.5A3.5 3.5 0 1112 8a3.5 3.5 0 010 7.5z"/></svg>
      );
    default:
      return <span aria-hidden="true">•</span>;
  }
}

/**
 * PUBLIC_INTERFACE
 * Sidebar renders primary navigation with grouping, icons, and accessibility.
 */
export default function Sidebar() {
  const { state, dispatch } = useApp();
  const collapsed = state.ui.sidebarCollapsed;
  const [current, setCurrent] = useState(getHashPath());
  const navRef = useRef(null);

  const isMobile = typeof window !== "undefined" ? window.innerWidth <= 1024 : false;

  useEffect(() => {
    const onHash = () => setCurrent(getHashPath());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Close with ESC on mobile when open
  useEffect(() => {
    if (!(isMobile && !collapsed)) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        dispatch({ type: "SIDEBAR_SET", payload: true });
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [collapsed, dispatch, isMobile]);

  const sections = useMemo(() => ([
    {
      title: "Main",
      items: [
        { key: "dashboard", label: "Dashboard", to: "/dashboard", icon: "dashboard" },
      ],
    },
    {
      title: "Operations",
      items: [
        { key: "customers", label: "Customers", to: "/customers", icon: "customers" },
        { key: "requests", label: "Requests", to: "/requests", icon: "requests" },
        { key: "workflows", label: "Workflows", to: "/workflows", icon: "workflows" },
        { key: "inbox", label: "Inbox", to: "/inbox", icon: "inbox" },
        { key: "complaints", label: "Complaints", to: "/complaints", icon: "complaints" },
      ],
    },
    {
      title: "Insights",
      items: [
        { key: "reports", label: "Reports", to: "/reports", icon: "reports" },
        { key: "analytics", label: "Analytics", to: "/analytics", icon: "dashboard" },
      ],
    },
    {
      title: "Admin",
      items: [
        { key: "admin-users", label: "Users", to: "/admin/users", icon: "admin" },
        { key: "admin-roles", label: "Roles", to: "/admin/roles", icon: "admin" },
        { key: "admin-audit", label: "Audit", to: "/admin/audit", icon: "admin" },
        { key: "settings", label: "Settings", to: "/settings", icon: "settings" },
      ],
    },
  ]), []);

  const onNavKeyDown = (e) => {
    const links = navRef.current ? Array.from(navRef.current.querySelectorAll("a.nav-link")) : [];
    if (links.length === 0) return;
    const idx = links.indexOf(document.activeElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = links[(idx + 1) % links.length];
      next && next.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = links[(idx - 1 + links.length) % links.length];
      prev && prev.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      links[0].focus();
    } else if (e.key === "End") {
      e.preventDefault();
      links[links.length - 1].focus();
    }
  };

  const userEmail = state.auth.user?.email || "agent@company";
  const userInitial = (userEmail[0] || "A").toUpperCase();

  return (
    <aside
      id="primary-sidebar"
      className="sidebar"
      aria-label="Primary"
      data-collapsed={collapsed ? "true" : "false"}
      role="complementary"
    >
      <div className="sidebar-inner">
        <div className="brand" aria-label="CRM">
          <span className="brand-icon" aria-hidden="true">🏛️</span>
          <span className="brand-text">Heritage CRM</span>
        </div>

        <nav
          className="nav"
          role="navigation"
          aria-label="Main navigation"
          onKeyDown={onNavKeyDown}
          ref={navRef}
        >
          {sections.map((sec) => (
            <div className="nav-section" key={sec.title}>
              <div className="section-title" aria-hidden="true">{sec.title}</div>
              <div className="section-items">
                {sec.items.map((it) => {
                  const active = isActivePath(current, it.to);
                  return (
                    <Link
                      key={it.key}
                      to={it.to}
                      className={`nav-link ${active ? "active" : ""}`}
                      aria-current={active ? "page" : undefined}
                      title={collapsed ? it.label : undefined}
                      onClick={() => {
                        // Close sidebar on mobile after navigation
                        if (isMobile) dispatch({ type: "SIDEBAR_SET", payload: true });
                      }}
                      role="link"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        // Ensure keyboard activation (Enter/Space) for accessibility
                        if (e.key === "Enter" || e.key === " ") {
                          e.currentTarget.click();
                        }
                      }}
                    >
                      <span className="icon" aria-hidden="true"><Icon name={it.icon} /></span>
                      <span className="label">{it.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="profile">
            <div className="avatar" aria-hidden="true">{userInitial}</div>
            <div className="meta">
              <div className="name">Agent</div>
              <div className="email text-muted" title={userEmail}>{userEmail}</div>
            </div>
          </div>
          <Link to="/requests/new" className="btn quick-action" aria-label="Create new request">
            + Create Request
          </Link>
        </div>
      </div>
    </aside>
  );
}
