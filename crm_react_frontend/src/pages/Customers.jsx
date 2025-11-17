import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import Card from "../components/Card";
import { get } from "../api/client";
import { customers as mockCustomers } from "../api/mockData";
import { navigate } from "../router/HashRouter";

/**
 * PUBLIC_INTERFACE
 * Customers page shows basic CRM list
 */
export default function Customers() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await get("/customers");
        setRows(data || []);
      } catch {
        setRows(mockCustomers);
      }
    })();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Customers</h1>
        <div>
          <button className="btn">+ New Customer</button>
        </div>
      </div>
      <Card>
        <Table
          columns={[
            { key: "id", title: "ID" },
            { key: "name", title: "Name" },
            { key: "segment", title: "Segment" },
            { key: "owner", title: "Owner" },
            { key: "city", title: "City" },
            { key: "score", title: "Score" },
          ]}
          data={rows}
          onRowClick={(r) => navigate(`/customers/${r.id}`)}
        />
      </Card>
    </div>
  );
}
