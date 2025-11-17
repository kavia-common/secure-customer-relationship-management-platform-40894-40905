import React from "react";
import Card from "../components/Card";
import DonutChart from "../components/DonutChart";

/**
 * PUBLIC_INTERFACE
 * Reports page
 */
export default function Reports() {
  return (
    <div>
      <div className="page-header">
        <h1>Reports</h1>
        <button className="btn">Export CSV</button>
      </div>
      <div className="grid grid-3">
        <DonutChart value={72} label="SLA Compliance" />
        <Card title="Monthly Trend">
          <div className="sparkline" style={{ "--p": "64%" }} />
        </Card>
        <Card title="Backlog">
          <div className="sparkline" style={{ "--p": "28%" }} />
        </Card>
      </div>
    </div>
  );
}
