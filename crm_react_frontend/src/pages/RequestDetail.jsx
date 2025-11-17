import React, { useMemo } from "react";
import Card from "../components/Card";
import Badge from "../components/Badge";
import { requests as mockRequests } from "../api/mockData";

/**
 * PUBLIC_INTERFACE
 * Request detail page from params.id
 */
export default function RequestDetail({ params }) {
  const req = useMemo(() => mockRequests.find((r) => r.id === params.id) || mockRequests[0], [params.id]);

  return (
    <div>
      <div className="page-header">
        <h1>{req.title} <span className="text-muted">({req.id})</span></h1>
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
