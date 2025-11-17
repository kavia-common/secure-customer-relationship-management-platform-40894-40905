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
 * - If params.id is numeric: use backend for history and transitions
 * - Else: fallback to mock data view
 */
export default function RequestDetail({ params }) {
  const isNumeric = /^\d+$/.test(params.id);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");

  // Mock fallback
  const req = useMemo(
    () => mockRequests.find((r) => r.id === params.id) || mockRequests[0],
    [params.id]
  );

  useEffect(() => {
    if (!isNumeric) return;
    (async () => {
      try {
        const h = await get(`/requests/${params.id}/history`);
        setHistory(h || []);
        const last = (h || [])[h.length - 1];
        setStatus(last?.to_status || last?.status || "open");
      } catch {
        setHistory([]);
        setStatus("open");
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
            {req.title} <span className="text-muted">({req.id})</span>
          </h1>
          <Badge variant={req.status === "Closed" ? "success" : "warning"}>{req.status}</Badge>
        </div>
        <div className="grid grid-3">
          <Card title="Summary">
            <div><strong>Priority:</strong> {req.priority}</div>
            <div><strong>Owner:</strong> {req.owner}</div>
            <div><strong>Created:</strong> {req.createdAt}</div>
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
      </div>
      <div className="grid grid-3">
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
          {history.length === 0 ? (
            <p className="text-muted">No history available.</p>
          ) : (
            <Table
              columns={[
                { key: "id", title: "ID" },
                { key: "from_status", title: "From" },
                { key: "to_status", title: "To" },
                { key: "note", title: "Note" },
              ]}
              data={history}
            />
          )}
        </Card>
        <Card title="Details">
          <p className="text-muted">Request details endpoint not exposed in current API spec.</p>
        </Card>
      </div>
    </div>
  );
}
