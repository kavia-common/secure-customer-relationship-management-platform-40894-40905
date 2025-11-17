import React, { useEffect, useMemo, useState } from "react";
import Table from "../components/Table";
import Card from "../components/Card";
import Pagination from "../components/Pagination";
import { Input } from "../components/Input";
import { getCustomers } from "../api/client";
import { customers as mockCustomers } from "../api/mockData";
import { navigate } from "../router/HashRouter";

/**
 * PUBLIC_INTERFACE
 * Customers page shows live list with search and pagination
 */
export default function Customers({ query = {} }) {
  const [q, setQ] = useState(query.q || "");
  const [page, setPage] = useState(Number(query.page || 1));
  const [pageSize, setPageSize] = useState(Number(query.page_size || 10));
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Sync local state if query changes externally
  useEffect(() => {
    const qp = query || {};
    const np = Number(qp.page || 1);
    const nps = Number(qp.page_size || 10);
    if ((qp.q || "") !== q) setQ(qp.q || "");
    if (np !== page) setPage(np);
    if (nps !== pageSize) setPageSize(nps);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const updateHash = () => {
    const usp = new URLSearchParams();
    usp.set("page", String(page));
    usp.set("page_size", String(pageSize));
    if (q) usp.set("q", q);
    const qs = usp.toString();
    window.location.hash = `#/customers${qs ? `?${qs}` : ""}`;
  };

  const fetchData = async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await getCustomers({ page, page_size: pageSize, q });
      const items = Array.isArray(data) ? data : (data?.items || []);
      const tot = Array.isArray(data) ? items.length : Number(data?.total || 0);
      setRows(items);
      setTotal(tot);
    } catch (e) {
      // Fallback to mock only if backend unreachable
      const msg = String(e && e.message ? e.message : e);
      if (!navigator.onLine || /Failed to fetch/i.test(msg)) {
        // Map mock data to table fields
        setRows(
          mockCustomers.map((c) => ({
            id: c.id,
            name: c.name,
            email: c.email,
            phone: c.phone,
          }))
        );
        setTotal(mockCustomers.length);
      } else {
        setErr("Failed to load customers.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, q]);

  const totalPages = useMemo(() => {
    const tp = Math.max(1, Math.ceil((total || 0) / (pageSize || 1)));
    return tp;
  }, [total, pageSize]);

  const onPage = (p) => {
    const np = Math.max(1, Math.min(p, totalPages));
    setPage(np);
    setTimeout(updateHash, 0);
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    updateHash();
    fetchData();
  };

  const columns = [
    { key: "id", title: "ID" },
    { key: "name", title: "Name" },
    { key: "email", title: "Email" },
    { key: "phone", title: "Phone" },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Customers</h1>
        <div>
          <button className="btn">+ New Customer</button>
        </div>
      </div>

      <Card title="Search">
        <form onSubmit={onSearchSubmit} style={{ display: "flex", gap: 12, alignItems: "end", flexWrap: "wrap" }}>
          <Input label="Query" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name/email/phone" />
          <Input label="Page size" type="number" min={1} max={200} value={pageSize} onChange={(e) => setPageSize(Number(e.target.value || 10))} />
          <div style={{ paddingBottom: 2 }}>
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
            onRowClick={(r) => navigate(`/customers/${r.id}`)}
          />
          <div className="mt-4">
            <Pagination page={page} totalPages={totalPages} onPage={onPage} />
          </div>
        </Card>
      </div>
    </div>
  );
}
