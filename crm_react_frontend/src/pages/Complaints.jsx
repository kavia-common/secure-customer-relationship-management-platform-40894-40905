import React from "react";
import Card from "../components/Card";
import Table from "../components/Table";
import { complaints as mockComplaints } from "../api/mockData";

/**
 * PUBLIC_INTERFACE
 * Complaints page
 */
export default function Complaints() {
  return (
    <div>
      <div className="page-header">
        <h1>Complaints</h1>
      </div>
      <Card>
        <Table
          columns={[
            { key: "id", title: "ID" },
            { key: "customerId", title: "Customer" },
            { key: "title", title: "Title" },
            { key: "severity", title: "Severity" },
            { key: "status", title: "Status" },
            { key: "createdAt", title: "Created" },
          ]}
          data={mockComplaints}
        />
      </Card>
    </div>
  );
}
