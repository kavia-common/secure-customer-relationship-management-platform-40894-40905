import React, { useEffect, useState } from "react";
import KPICard from "../components/KPICard";
import DonutChart from "../components/DonutChart";
import Card from "../components/Card";
import Table from "../components/Table";
import { get } from "../api/client";
import { requests as mockRequests } from "../api/mockData";
import { navigate } from "../router/HashRouter";

/**
 * PUBLIC_INTERFACE
 * Dashboard with KPI metrics and CSS-only visuals
 */
export default function Dashboard() {
  const [recent, setRecent] = useState([]);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const m = await get("/metrics/summary");
        setMetrics(m || null);
      } catch {
        setMetrics(null);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        // No backend endpoint for recent requests in spec; use mock fallback
        setRecent(mockRequests.slice(0, 5));
      } catch {
        setRecent(mockRequests.slice(0, 5));
      }
    })();
  }, []);

  const openRequests = metrics?.open_requests ?? 128;
  const resolved7d = metrics?.resolved_requests_last_7d ?? 23;
  const customers = metrics?.customers ?? 540;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <div>
          <button className="btn" onClick={() => navigate("/requests/new")}>+ New Request</button>
        </div>
      </div>

      <div className="grid grid-4">
        <KPICard label="Open Requests" value={openRequests} change={12} changeLabel="vs last week" sparkPercent={72} />
        <KPICard label="Resolved (7d)" value={resolved7d} change={-4} changeLabel="vs prior 7d" sparkPercent={35} />
        <KPICard label="Customers" value={customers} change={8} changeLabel="net new last 30d" sparkPercent={58} />
        <KPICard label="CSAT" value="4.6" change={2} changeLabel="avg last 30d" sparkPercent={66} />
      </div>

      <div className="grid grid-3 mt-6">
        <DonutChart value={68} label="Closed vs Open" />
        <Card title="Channel Mix">
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><div className="badge info">Email</div><div className="mt-4"><div className="sparkline" style={{ "--p": "55%" }} /></div></div>
            <div><div className="badge info">Phone</div><div className="mt-4"><div className="sparkline" style={{ "--p": "35%" }} /></div></div>
            <div><div className="badge info">Chatbot</div><div className="mt-4"><div className="sparkline" style={{ "--p": "22%" }} /></div></div>
            <div><div className="badge info">Social</div><div className="mt-4"><div className="sparkline" style={{ "--p": "14%" }} /></div></div>
          </div>
        </Card>
        <Card title="Recent Requests" headerRight={<button className="btn ghost" onClick={() => navigate("/requests")}>View all</button>}>
          <Table
            columns={[
              { key: "id", title: "ID" },
              { key: "title", title: "Title" },
              { key: "status", title: "Status" },
              { key: "priority", title: "Priority" },
              { key: "createdAt", title: "Created" },
            ]}
            data={recent}
            onRowClick={(r) => navigate(`/requests/${r.id}`)}
          />
        </Card>
      </div>
    </div>
  );
}
