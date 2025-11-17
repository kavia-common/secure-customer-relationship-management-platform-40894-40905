import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import { get } from "../api/client";
import { requests as mockRequests } from "../api/mockData";
import { navigate } from "../router/HashRouter";

/**
 * PUBLIC_INTERFACE
 * Requests list with pagination
 */
export default function Requests() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    (async () => {
      try {
        const data = await get("/requests");
        setRows(data || []);
      } catch {
        setRows(mockRequests);
      }
    })();
  }, []);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const paged = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <div className="page-header">
        <h1>Service Requests</h1>
        <button className="btn" onClick={() => navigate("/requests/new")}>+ New Request</button>
      </div>
      <Card>
        <Table
          columns={[
            { key: "id", title: "ID" },
            { key: "title", title: "Title" },
            { key: "status", title: "Status" },
            { key: "priority", title: "Priority" },
            { key: "owner", title: "Owner" },
            { key: "createdAt", title: "Created" },
          ]}
          data={paged}
          onRowClick={(r) => navigate(`/requests/${r.id}`)}
        />
        <div className="mt-4">
          <Pagination page={page} totalPages={totalPages} onPage={setPage} />
        </div>
      </Card>
    </div>
  );
}
