import React from "react";
import Card from "../components/Card";

/**
 * PUBLIC_INTERFACE
 * Inbox page placeholder for agent tasks and notifications.
 */
export default function Inbox() {
  return (
    <div>
      <div className="page-header">
        <h1>Inbox</h1>
      </div>
      <Card>
        <p className="text-muted">Your inbox is empty.</p>
      </Card>
    </div>
  );
}
