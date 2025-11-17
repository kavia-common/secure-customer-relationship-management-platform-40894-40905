import React from "react";
import { AppProvider } from "./state/AppContext";
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

/**
 * PUBLIC_INTERFACE
 * App is the root component for the CRM front-end.
 */
function App() {
  const routes = [
    { path: "/", component: Dashboard },
    { path: "/login", component: Login },
    { path: "/customers", component: Customers },
    { path: "/customers/:id", component: CustomerDetail },
    { path: "/requests", component: Requests },
    { path: "/requests/new", component: NewRequest },
    { path: "/requests/:id", component: RequestDetail },
    { path: "/complaints", component: Complaints },
    { path: "/reports", component: Reports },
    { path: "/analytics", component: Analytics },
    { path: "/audit", component: Audit },
    { path: "/settings", component: Settings },
    { path: "*", component: NotFound },
  ];

  return (
    <AppProvider>
      <a href="#main" className="visually-hidden">Skip to content</a>
      <div className="app-shell">
        <Sidebar />
        <Topbar />
        <main id="main" className="main" role="main" aria-live="polite">
          <HashRouter routes={routes} notFound={NotFound} />
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
