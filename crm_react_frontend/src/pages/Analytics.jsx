import React from "react";
import Card from "../components/Card";

/**
 * PUBLIC_INTERFACE
 * Analytics (CSS-only KPIs)
 */
export default function Analytics() {
  return (
    <div>
      <div className="page-header">
        <h1>Analytics</h1>
      </div>
      <div className="grid grid-3">
        <Card title="First Contact Resolution">
          <div className="sparkline" style={{ "--p": "78%" }} />
        </Card>
        <Card title="Escalation Rate">
          <div className="sparkline" style={{ "--p": "18%" }} />
        </Card>
        <Card title="Utilization">
          <div className="sparkline" style={{ "--p": "66%" }} />
        </Card>
      </div>
    </div>
  );
}
