import React, { useMemo } from "react";
import { AppProvider, useApp } from "./state/AppContext";
import { HashRouter } from "./router/HashRouter";
import "./styles/theme.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/charts.css";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import CustomerDetail from "./pages/CustomerDetail";
import Requests from "./pages/Requests";
import RequestDetail from "./pages/RequestDetail";
import NewRequest from "./pages/NewRequest";
import Complaints from "./pages/Complaints";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Audit from "./pages/Audit";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Workflows from "./pages/Workflows";
import Inbox from "./pages/Inbox";
import AdminUsers from "./pages/AdminUsers";
import AdminRoles from "./pages/AdminRoles";

/**
 * PUBLIC_INTERFACE
 * App is the root component for the CRM front-end.
 */
function App() {
  const routes = [
    { path: "/", component: Dashboard },
    { path: "/dashboard", component: Dashboard },

    { path: "/login", component: Login },

    { path: "/customers", component: Customers },
    { path: "/customers/:id", component: CustomerDetail },

    { path: "/requests", component: Requests },
    { path: "/requests/new", component: NewRequest },
    { path: "/requests/:id", component: RequestDetail },

    { path: "/complaints", component: Complaints },
    { path: "/reports", component: Reports },
    { path: "/analytics", component: Analytics },

    { path: "/workflows", component: Workflows },
    { path: "/inbox", component: Inbox },

    { path: "/admin/users", component: AdminUsers },
    { path: "/admin/roles", component: AdminRoles },
    { path: "/admin/audit", component: Audit },

    // Backward compatibility route
    { path: "/audit", component: Audit },

    { path: "/settings", component: Settings },
    { path: "*", component: NotFound },
  ];

  function AppShell() {
    const { state, dispatch } = useApp();
    const collapsed = state.ui.sidebarCollapsed;
    const isMobile = typeof window !== "undefined" ? window.innerWidth <= 1024 : false;

    const shellClass = useMemo(() => {
      const classes = ["app-shell"];
      if (collapsed) classes.push("sidebar-collapsed");
      if (isMobile) classes.push("is-mobile");
      if (isMobile && !collapsed) classes.push("sidebar-open");
      return classes.join(" ");
    }, [collapsed, isMobile]);

    return (
      <>
        <a href="#main" className="visually-hidden">Skip to content</a>
        <div className={shellClass}>
          <Sidebar />
          <Topbar />
          <main id="main" className="main" role="main" aria-live="polite">
            <HashRouter routes={routes} notFound={NotFound} />
          </main>
        </div>
        {isMobile && !collapsed && (
          <button
            className="sidebar-backdrop"
            aria-label="Close sidebar"
            onClick={() => dispatch({ type: "SIDEBAR_SET", payload: true })}
            tabIndex={-1}
          />
        )}
      </>
    );
  }

  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

export default App;
