import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { getQueue, setDispatch, syncQueue, getAuthToken, get } from "../api/client";

const AppContext = createContext(null);

const initialState = {
  auth: { token: null, user: null },
  ui: { theme: "light", sidebarCollapsed: false, notifications: [] },
  data: { customers: [], requests: [], complaints: [], auditLogs: [] },
  offline: { queue: [], online: typeof navigator !== "undefined" ? navigator.onLine : true },
};

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, auth: { token: action.payload.token, user: action.payload.user || state.auth.user } };
    case "SET_USER":
      return { ...state, auth: { ...state.auth, user: action.payload } };
    case "LOGOUT":
      return { ...state, auth: { token: null, user: null } };
    case "SET_THEME":
      return { ...state, ui: { ...state.ui, theme: action.payload } };
    case "SIDEBAR_TOGGLE":
      return { ...state, ui: { ...state.ui, sidebarCollapsed: !state.ui.sidebarCollapsed } };
    case "SIDEBAR_SET":
      return { ...state, ui: { ...state.ui, sidebarCollapsed: !!action.payload } };
    case "NOTIFY":
      return { ...state, ui: { ...state.ui, notifications: [...state.ui.notifications, action.payload] } };
    case "DISMISS_NOTIFY":
      return { ...state, ui: { ...state.ui, notifications: state.ui.notifications.slice(1) } };
    case "SET_CUSTOMERS":
      return { ...state, data: { ...state.data, customers: action.payload } };
    case "SET_REQUESTS":
      return { ...state, data: { ...state.data, requests: action.payload } };
    case "SET_COMPLAINTS":
      return { ...state, data: { ...state.data, complaints: action.payload } };
    case "SET_AUDIT":
      return { ...state, data: { ...state.data, auditLogs: action.payload } };
    case "QUEUE_SET":
      return { ...state, offline: { ...state.offline, queue: action.payload } };
    case "ONLINE_SET":
      return { ...state, offline: { ...state.offline, online: action.payload } };
    default:
      return state;
  }
}

/**
 * PUBLIC_INTERFACE
 * AppProvider wraps the application and sets up global state and effects.
 */
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Provide dispatch to API client for queue updates
  useEffect(() => {
    setDispatch(dispatch);
    dispatch({ type: "QUEUE_SET", payload: getQueue() });
  }, []);

  // Theme sync to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.ui.theme);
  }, [state.ui.theme]);

  // Initialize auth from stored token and fetch profile
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      dispatch({ type: "LOGIN", payload: { token, user: null } });
      (async () => {
        try {
          const me = await get("/auth/me");
          dispatch({ type: "SET_USER", payload: me });
        } catch {
          // ignore; token might be invalid or backend unavailable
        }
      })();
    }
  }, []);

  // Sidebar persistence and responsiveness
  useEffect(() => {
    const key = "crm_sidebar_collapsed";
    // Load saved preference or set based on initial viewport
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        dispatch({ type: "SIDEBAR_SET", payload: JSON.parse(saved) });
      } else if (typeof window !== "undefined" && window.innerWidth <= 1024) {
        dispatch({ type: "SIDEBAR_SET", payload: true }); // auto collapse on small screens
      }
    } catch {
      // ignore storage errors
    }

    // Collapse automatically on small viewports
    const onResize = () => {
      if (window.innerWidth <= 1024) {
        dispatch({ type: "SIDEBAR_SET", payload: true });
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Persist sidebar preference
  useEffect(() => {
    const key = "crm_sidebar_collapsed";
    try {
      localStorage.setItem(key, JSON.stringify(state.ui.sidebarCollapsed));
    } catch {
      // ignore
    }
  }, [state.ui.sidebarCollapsed]);

  // Online/offline handling
  useEffect(() => {
    const onOnline = async () => {
      dispatch({ type: "ONLINE_SET", payload: true });
      const { synced } = await syncQueue();
      if (synced > 0) {
        dispatch({ type: "NOTIFY", payload: { type: "success", message: `Synced ${synced} queued ops` } });
      }
    };
    const onOffline = () => dispatch({ type: "ONLINE_SET", payload: false });

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * useApp returns { state, dispatch } for global usage.
 */
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
