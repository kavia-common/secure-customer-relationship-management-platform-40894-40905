import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import Table from "../components/Table";
import { auditLogs as mockAuditLogs } from "../api/mockData";
import { get } from "../api/client";

/**
 * PUBLIC_INTERFACE
 * Audit logs page
 */
export default function Audit() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await get("/admin/audit");
        setRows(data || []);
      } catch {
        setRows(mockAuditLogs);
      }
    })();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Audit</h1>
      </div>
      <Card>
        <Table
          columns={[
            { key: "id", title: "ID" },
            { key: "actor", title: "Actor" },
            { key: "action", title: "Action" },
            { key: "details", title: "Details" },
            { key: "at", title: "Timestamp" },
          ]}
          data={rows}
        />
      </Card>
    </div>
  );
}
