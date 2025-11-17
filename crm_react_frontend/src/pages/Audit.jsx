import React from "react";
import Card from "../components/Card";
import Table from "../components/Table";
import { auditLogs } from "../api/mockData";

/**
 * PUBLIC_INTERFACE
 * Audit logs page
 */
export default function Audit() {
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
          data={auditLogs}
        />
      </Card>
    </div>
  );
}
