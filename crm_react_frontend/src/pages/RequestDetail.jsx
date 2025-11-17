import React, { useEffect, useMemo, useState } from "react";
import Card from "../components/Card";
import Badge from "../components/Badge";
import { Input, Select } from "../components/Input";
import Button from "../components/Button";
import Table from "../components/Table";
import { requests as mockRequests } from "../api/mockData";
import { get, mutate } from "../api/client";

/**
 * PUBLIC_INTERFACE
 * Request detail page from params.id
 * - Numeric IDs use backend for detail, history and transitions
 * - Non-numeric IDs fall back to mock data view
 */
export default function RequestDetail({ params }) {
  const isNumeric = /^\d+$/.test(params.id);

  const [detail, setDetail] = useState(null);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [err, setErr] = useState("");

  // Mock fallback for non-numeric
  const mockReq = useMemo(
    () => mockRequests.find((r) => r.id === params.id) || mockRequests[0],
    [params.id]
  );

  const toHumanPriority = (p) => {
    if (p === "low") return "Low";
    if (p === "normal") return "Medium";
    if (p === "high") return "High";
    return p || "—";
  };

  useEffect(() => {
    if (!isNumeric) return;
    setLoadingDetail(true);
    setErr("");
    (async () => {
      try {
        const data = await get(`/requests/${params.id}`);
        setDetail(data);
        setStatus(data?.status || "open");
      } catch (e) {
        const msg = String(e && e.message ? e.message : e);
        if (!navigator.onLine || /Failed to fetch/i.test(msg)) {
          setDetail(null); // backend unreachable
          setErr("Backend unreachable. Limited view.");
        } else {
          setErr("Failed to load request.");
        }
      } finally {
        setLoadingDetail(false);
      }
    })();
  }, [params.id, isNumeric]);

  useEffect(() => {
    if (!isNumeric) return;
    setLoadingHistory(true);
    (async () => {
      try {
        const h = await get(`/requests/${params.id}/history`);
        setHistory(Array.isArray(h) ? h : []);
      } catch {
        setHistory([]);
      } finally {
        setLoadingHistory(false);
      }
    })();
  }, [params.id, isNumeric]);

  const onTransition = async (e) => {
    e.preventDefault();
    const res = await mutate("POST", `/requests/${params.id}/transition`, { to_status: status, note: note || null });
    if (res.queued) {
      alert("Offline: transition queued.");
    } else {
      alert("Status updated.");
    }
    try {
      const h = await get(`/requests/${params.id}/history`);
      setHistory(h || []);
    } catch {
      // ignore
    }
    setNote("");
  };

  if (!isNumeric) {
    // Mock view
    return (
      <div>
        <div className="page-header">
          <h1>
            {mockReq.title} <span className="text-muted">({mockReq.id})</span>
          </h1>
          <Badge variant={mockReq.status === "Closed" ? "success" : "warning"}>{mockReq.status}</Badge>
        </div>
        <div className="grid grid-3">
          <Card title="Summary">
            <div><strong>Priority:</strong> {mockReq.priority}</div>
            <div><strong>Owner:</strong> {mockReq.owner}</div>
            <div><strong>Created:</strong> {mockReq.createdAt}</div>
          </Card>
          <Card title="Timeline">
            <p className="text-muted">No timeline entries.</p>
          </Card>
            <Card title="Attachments">
            <p className="text-muted">No attachments.</p>
          </Card>
        </div>
      </div>
    );
  }

  // API-driven view for numeric ids
  return (
    <div>
      <div className="page-header">
        <h1>Request #{params.id}</h1>
        {detail && <Badge variant={detail.status === "closed" ? "success" : "info"}>{detail.status}</Badge>}
      </div>

      {err && (
        <Card>
          <div className="text-error pad-4" role="alert">{err}</div>
        </Card>
      )}

      <div className="grid grid-3">
        <Card title="Details">
          {loadingDetail ? (
            <p className="text-muted">Loading…</p>
          ) : !detail ? (
            <p className="text-muted">No details available.</p>
          ) : (
            <div style={{ display: "grid", gap: 6 }}>
              <div><strong>Subject:</strong> {detail.subject}</div>
              <div><strong>Customer:</strong> #{detail.customer_id}</div>
              <div><strong>Assignee:</strong> {detail.assignee_id ? `Agent #${detail.assignee_id}` : "Unassigned"}</div>
              <div><strong>Priority:</strong> {toHumanPriority(detail.priority)}</div>
              <div><strong>Status:</strong> {detail.status}</div>
              <div><strong>Description:</strong> {detail.description}</div>
            </div>
          )}
        </Card>

        <Card title="Status Transition">
          <form onSubmit={onTransition} style={{ display: "grid", gap: 12 }}>
            <Select label="To Status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="open">open</option>
              <option value="pending">pending</option>
              <option value="in_progress">in_progress</option>
              <option value="closed">closed</option>
            </Select>
            <Input label="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
            <Button type="submit">Update Status</Button>
          </form>
        </Card>

        <Card title="History">
          <Table
            columns={[
              { key: "id", title: "ID" },
              { key: "from_status", title: "From" },
              { key: "to_status", title: "To" },
              { key: "note", title: "Note" },
            ]}
            data={history}
            loading={loadingHistory}
            emptyMessage="No history available."
          />
        </Card>
      </div>
    </div>
  );
}
