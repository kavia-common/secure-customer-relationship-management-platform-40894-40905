import React, { useEffect, useMemo, useState } from "react";
import { customers as mockCustomers, requests as mockRequests } from "../api/mockData";
import Card from "../components/Card";
import Tabs from "../components/Tabs";
import Table from "../components/Table";
import { get } from "../api/client";

/**
 * PUBLIC_INTERFACE
 * Customer detail from params.id
 * - If params.id is numeric: fetch from backend
 * - Else: fallback to mock data
 */
export default function CustomerDetail({ params }) {
  const isNumeric = /^\d+$/.test(params.id);
  const [apiCustomer, setApiCustomer] = useState(null);

  useEffect(() => {
    if (!isNumeric) return;
    (async () => {
      try {
        const data = await get(`/customers/${params.id}`);
        setApiCustomer(data);
      } catch {
        setApiCustomer(null);
      }
    })();
  }, [params.id, isNumeric]);

  const cust = useMemo(() => {
    if (isNumeric) {
      return apiCustomer || { id: Number(params.id), name: `Customer #${params.id}`, segment: "N/A", owner: "—", email: "—", phone: "—", city: "—", score: "—" };
    }
    return mockCustomers.find((c) => c.id === params.id) || mockCustomers[0];
  }, [params.id, isNumeric, apiCustomer]);

  const related = useMemo(() => mockRequests.filter((r) => String(r.customerId) === String(cust.id)), [cust.id]);
  const [tab, setTab] = useState("profile");

  return (
    <div>
      <div className="page-header">
        <h1>{cust.name}</h1>
        <div className="badge info">{cust.segment || "—"}</div>
      </div>
      <Tabs tabs={[
        { key: "profile", label: "Profile" },
        { key: "requests", label: "Requests" },
        { key: "activity", label: "Activity" },
      ]} active={tab} onChange={setTab} />
      <div className="mt-6 grid grid-3">
        {tab === "profile" && (
          <>
            <Card title="Overview">
              <div><strong>Owner:</strong> {cust.owner || "—"}</div>
              <div><strong>Email:</strong> {cust.email || "—"}</div>
              <div><strong>Phone:</strong> {cust.phone || "—"}</div>
              <div><strong>City:</strong> {cust.city || "—"}</div>
              <div><strong>Health Score:</strong> {String(cust.score ?? "—")}</div>
            </Card>
            <Card title="Notes">
              <p className="text-muted">No notes added.</p>
            </Card>
            <Card title="Contacts">
              <p className="text-muted">No contacts added.</p>
            </Card>
          </>
        )}
        {tab === "requests" && (
          <Card title="Service Requests">
            <Table
              columns={[
                { key: "id", title: "ID" },
                { key: "title", title: "Title" },
                { key: "status", title: "Status" },
                { key: "priority", title: "Priority" },
                { key: "createdAt", title: "Created" },
              ]}
              data={related}
            />
          </Card>
        )}
        {tab === "activity" && <Card title="Recent Activity"><p className="text-muted">No recent activity.</p></Card>}
      </div>
    </div>
  );
}
