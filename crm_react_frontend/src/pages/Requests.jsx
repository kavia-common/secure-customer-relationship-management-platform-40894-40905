import React, { useEffect, useMemo, useState } from "react";
import Card from "../components/Card";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import { get } from "../api/client";
import { requests as mockRequests } from "../api/mockData";
import { navigate } from "../router/HashRouter";
import { Input, Select } from "../components/Input";

/**
 * PUBLIC_INTERFACE
 * Requests list with live backend integration, filters, and pagination.
 */
export default function Requests({ query = {} }) {
  const pageSize = 10;

  // Initialize from hash query if present
  const [page, setPage] = useState(Number(query.page || 1));
  const [status, setStatus] = useState(query.status || "all");
  const [priority, setPriority] = useState(query.priority || "all"); // values: all | low | normal | high
  const [assignee, setAssignee] = useState(query.assignee || "");
  const [customerId, setCustomerId] = useState(query.customer_id || "");
  const [dateFrom, setDateFrom] = useState(query.date_from || "");
  const [dateTo, setDateTo] = useState(query.date_to || "");

  const [rows, setRows] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // keep hash query in sync (preserve filters and page)
  const updateHash = () => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("page_size", String(pageSize));
    if (status && status !== "all") params.set("status", status);
    if (priority && priority !== "all") params.set("priority", priority);
    if (assignee) params.set("assignee", assignee);
    if (customerId) params.set("customer_id", customerId);
    if (dateFrom) params.set("date_from", dateFrom);
    if (dateTo) params.set("date_to", dateTo);
    const qs = params.toString();
    window.location.hash = `#/requests${qs ? `?${qs}` : ""}`;
  };

  // When the router query changes externally (e.g. manual URL edit), update local state
  useEffect(() => {
    const qp = query || {};
    const qpPage = Number(qp.page || 1);
    if (qpPage !== page) setPage(qpPage);
    if ((qp.status || "all") !== status) setStatus(qp.status || "all");
    if ((qp.priority || "all") !== priority) setPriority(qp.priority || "all");
    if ((qp.assignee || "") !== assignee) setAssignee(qp.assignee || "");
    if ((qp.customer_id || "") !== customerId) setCustomerId(qp.customer_id || "");
    if ((qp.date_from || "") !== dateFrom) setDateFrom(qp.date_from || "");
    if ((qp.date_to || "") !== dateTo) setDateTo(qp.date_to || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const toHumanPriority = (p) => {
    if (p === "low") return "Low";
    if (p === "normal") return "Medium";
    if (p === "high") return "High";
    return p || "—";
  };

  const fetchData = async () => {
    setLoading(true);
    setErr("");
    try {
      // translate UI date_from/date_to to backend start/end
      const params = {
        page,
        page_size: pageSize,
        status: status !== "all" ? status : undefined,
        priority: priority !== "all" ? priority : undefined,
        assignee: assignee ? Number(assignee) : undefined,
        customer_id: customerId ? Number(customerId) : undefined,
        start: dateFrom || undefined,
        end: dateTo || undefined,
      };
      const data = await get("/requests", params);
      // Backend returns array of RequestOut
      setRows(Array.isArray(data) ? data : []);
      setHasMore(Array.isArray(data) && data.length === pageSize);
    } catch (e) {
      // minimal fallback only when backend is unreachable (network failure)
      const msg = String(e && e.message ? e.message : e);
      if (!navigator.onLine || /Failed to fetch/i.test(msg)) {
        setRows(mockRequests.map((r, idx) => ({
          id: idx + 1,
          customer_id: 1,
          subject: r.title,
          description: "",
          priority: r.priority?.toLowerCase?.() === "high" ? "high" : r.priority?.toLowerCase?.() === "low" ? "low" : "normal",
          status: r.status?.toLowerCase?.() || "open",
          assignee_id: null,
          meta: { created_at: r.createdAt }
        })));
        setHasMore(false);
      } else {
        setErr("Failed to load requests.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status, priority, assignee, customerId, dateFrom, dateTo]);

  const totalPages = useMemo(() => (hasMore ? page + 1 : page), [page, hasMore]);

  const onPage = (p) => {
    const np = Math.max(1, Math.min(p, totalPages));
    setPage(np);
    // reflect in url
    setTimeout(updateHash, 0);
  };

  const onApplyFilters = (e) => {
    e.preventDefault();
    setPage(1);
    updateHash();
    fetchData();
  };

  const onReset = () => {
    setStatus("all");
    setPriority("all");
    setAssignee("");
    setCustomerId("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
    setTimeout(updateHash, 0);
  };

  const columns = [
    { key: "id", title: "ID" },
    { key: "customer_id", title: "Customer", render: (v) => (v ? `#${v}` : "—") },
    { key: "subject", title: "Subject" },
    { key: "priority", title: "Priority", render: (v) => toHumanPriority(v) },
    { key: "status", title: "Status" },
    { key: "assignee_id", title: "Assignee", render: (v) => (v ? `Agent #${v}` : "Unassigned") },
    { key: "sla_due", title: "SLA Due", render: (_v, row) => row?.meta?.sla_due || "—" },
    { key: "created_at", title: "Created", render: (_v, row) => row?.meta?.created_at || "—" },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Service Requests</h1>
        <button className="btn" onClick={() => navigate("/requests/new")}>+ New Request</button>
      </div>
      <Card title="Filters">
        <form onSubmit={onApplyFilters} style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(6, minmax(0, 1fr))" }}>
          <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="open">open</option>
            <option value="pending">pending</option>
            <option value="in_progress">in_progress</option>
            <option value="closed">closed</option>
          </Select>
          <Select label="Priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="normal">Medium</option>
            <option value="high">High</option>
          </Select>
          <Input label="Assignee ID" type="number" value={assignee} onChange={(e) => setAssignee(e.target.value)} placeholder="e.g. 42" />
          <Input label="Customer ID" type="number" value={customerId} onChange={(e) => setCustomerId(e.target.value)} placeholder="e.g. 1001" />
          <Input label="Date From" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <Input label="Date To" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button type="button" className="btn ghost" onClick={onReset}>Reset</button>
            <button type="submit" className="btn">Apply</button>
          </div>
        </form>
      </Card>

      <div className="mt-6">
        <Card>
          {err && (
            <div className="pad-4" role="alert">
              <span className="text-error">{err}</span>
            </div>
          )}
          <Table
            columns={columns}
            data={rows}
            loading={loading}
            onRowClick={(r) => navigate(`/requests/${r.id}`)}
          />
          <div className="mt-4">
            <Pagination page={page} totalPages={totalPages} onPage={onPage} />
          </div>
        </Card>
      </div>
    </div>
  );
}
