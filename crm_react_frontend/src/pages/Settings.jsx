import React from "react";
import Card from "../components/Card";
import { useApp } from "../state/AppContext";

/**
 * PUBLIC_INTERFACE
 * Settings page for theme and preferences
 */
export default function Settings() {
  const { state, dispatch } = useApp();
  return (
    <div>
      <div className="page-header">
        <h1>Settings</h1>
      </div>
      <div className="grid grid-3">
        <Card title="Appearance">
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn" onClick={() => dispatch({ type: "SET_THEME", payload: "light" })} aria-pressed={state.ui.theme === "light"}>Light</button>
            <button className="btn secondary" onClick={() => dispatch({ type: "SET_THEME", payload: "dark" })} aria-pressed={state.ui.theme === "dark"}>Dark</button>
          </div>
        </Card>
        <Card title="Profile">
          <p className="text-muted">Profile settings will appear here.</p>
        </Card>
      </div>
    </div>
  );
}
