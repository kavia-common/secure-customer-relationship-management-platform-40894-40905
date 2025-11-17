import React, { useEffect, useMemo, useState } from "react";
import Card from "../components/Card";
import Tabs from "../components/Tabs";
import Table from "../components/Table";
import { getCustomerById } from "../api/client";
import { customers as mockCustomers, requests as mockRequests } from "../api/mockData";

/**
 * PUBLIC_INTERFACE
 * Customer detail view
 * - If params.id is numeric: fetch from backend
 * - Else: fallback to mock data
 */
export default function CustomerDetail({ params }) {
  const isNumeric = /^\d+$/.test(params.id);
  const [apiCustomer, setApiCustomer] = useState(null);
  const [loading, setLoading] = useState(isNumeric);
  const [err, setErr] = useState("");
  const [tab, setTab] = useState("details");

  useEffect(() => {
    if (!isNumeric) return;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const data = await getCustomerById(params.id);
        setApiCustomer(data);
      } catch (e) {
        const msg = String(e && e.message ? e.message : e);
        if (!navigator.onLine || /Failed to fetch/i.test(msg)) {
          setApiCustomer(null);
        } else {
          setErr("Failed to load customer.");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id, isNumeric]);

  const cust = useMemo(() => {
    if (isNumeric) {
      // Build a minimal shell while loading/fallback
      return apiCustomer || {
        id: Number(params.id),
        name: `Customer #${params.id}`,
        email: "—",
        phone: "—",
        data: {},
        interactions: [],
        open_requests: [],
      };
    }
    // Fallback from mock dataset by string id
    return (
      mockCustomers.find((c) => c.id === params.id) || {
        id: params.id,
        name: String(params.id),
        email: "—",
        phone: "—",
        data: {},
      }
    );
  }, [params.id, isNumeric, apiCustomer]);

  const interactions = useMemo(() => {
    if (apiCustomer?.interactions && Array.isArray(apiCustomer.interactions)) return apiCustomer.interactions;
    return []; // no mock interactions available
  }, [apiCustomer]);

  const reqs = useMemo(() => {
    if (apiCustomer?.open_requests && Array.isArray(apiCustomer.open_requests)) return apiCustomer.open_requests;
    // mock fallback by matching mockRequests
    return mockRequests
      .filter((r) => String(r.customerId) === String(cust.id))
      .map((r, idx) => ({
        id: idx + 1,
        subject: r.title,
        status: String(r.status || "Open").toLowerCase(),
        priority: String(r.priority || "Medium").toLowerCase(),
      }));
  }, [apiCustomer, cust.id]);

  return (
    <div>
      <div className="page-header">
        <h1>{cust.name}</h1>
        {!!cust.email && <div className="badge info" title={cust.email}>{cust.email}</div>}
      </div>

      <Tabs
        tabs={[
          { key: "details", label: "Details" },
          { key: "interactions", label: "Interactions" },
          { key: "requests", label: "Requests" },
        ]}
        active={tab}
        onChange={setTab}
      />

      <div className="mt-6 grid grid-3">
        {tab === "details" && (
          <>
            <Card title="Overview">
              {loading ? (
                <p className="text-muted">Loading…</p>
              ) : err ? (
                <p className="text-error">{err}</p>
              ) : (
                <>
                  <div><strong>Email:</strong> {cust.email || "—"}</div>
                  <div><strong>Phone:</strong> {cust.phone || "—"}</div>
                  <div><strong>Extra:</strong> {cust.data ? JSON.stringify(cust.data) : "—"}</div>
                </>
              )}
            </Card>
            <Card title="Notes">
              <p className="text-muted">No notes added.</p>
            </Card>
            <Card title="Contacts">
              <p className="text-muted">No contacts added.</p>
            </Card>
          </>
        )}

        {tab === "interactions" && (
          <Card title="Recent Interactions">
            <Table
              columns={[
                { key: "id", title: "ID" },
                { key: "type", title: "Type" },
                { key: "channel", title: "Channel" },
                { key: "content", title: "Content" },
              ]}
              data={interactions}
              loading={loading && isNumeric && !apiCustomer}
              emptyMessage="No interactions"
            />
          </Card>
        )}

        {tab === "requests" && (
          <Card title="Open Requests">
            <Table
              columns={[
                { key: "id", title: "ID" },
                { key: "subject", title: "Subject" },
                { key: "status", title: "Status" },
                { key: "priority", title: "Priority" },
              ]}
              data={reqs}
              loading={loading && isNumeric && !apiCustomer}
              emptyMessage="No requests"
            />
          </Card>
        )}
      </div>
    </div>
  );
}
