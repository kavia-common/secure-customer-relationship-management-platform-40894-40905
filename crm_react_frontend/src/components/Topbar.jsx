import React from "react";
import { useApp } from "../state/AppContext";
import { syncQueue } from "../api/client";
import { navigate } from "../router/HashRouter";

/**
 * PUBLIC_INTERFACE
 * Topbar shows global actions and offline queue indicator.
 */
export default function Topbar() {
  const { state, dispatch } = useApp();
  const { online, queue } = state.offline;

  const onThemeToggle = () => {
    dispatch({ type: "SET_THEME", payload: state.ui.theme === "light" ? "dark" : "light" });
  };

  const onSync = async () => {
    const { synced } = await syncQueue();
    if (synced === 0) {
      dispatch({ type: "NOTIFY", payload: { type: "info", message: "No queued operations to sync" } });
    }
  };

  const collapsed = state.ui.sidebarCollapsed;
  const isMobile = typeof window !== "undefined" ? window.innerWidth <= 1024 : false;

  return (
    <header className="topbar" role="banner">
      <div className="left">
        <button
          className="btn ghost"
          aria-label="Toggle Sidebar"
          aria-controls="primary-sidebar"
          aria-expanded={isMobile ? !collapsed : !collapsed}
          aria-pressed={!collapsed}
          onClick={() => dispatch({ type: "SIDEBAR_TOGGLE" })}
        >
          ☰
        </button>
        <div className="search" role="search">
          <span className="icon" aria-hidden="true">🔎</span>
          <input
            className="input"
            placeholder="Search customers, requests…"
            aria-label="Search"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate("/customers");
              }
            }}
          />
        </div>
      </div>
      <div className="right">
        <span role="status" aria-live="polite" className={`badge ${online ? "success" : "warning"}`}>
          {online ? "Online" : "Offline"}
        </span>
        <button className="btn secondary" onClick={onSync} aria-label={`Sync Queue (${queue.length})`}>
          ⟳ Queue {queue.length}
        </button>
        <button className="btn ghost" onClick={onThemeToggle} aria-label="Toggle theme">🌓</button>
        <button className="btn" onClick={() => navigate("/login")}>Login</button>
      </div>
    </header>
  );
}
