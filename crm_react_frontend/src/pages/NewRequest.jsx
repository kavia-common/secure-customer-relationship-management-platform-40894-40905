import React, { useState } from "react";
import Card from "../components/Card";
import { Input, Select } from "../components/Input";
import Button from "../components/Button";
import { mutate } from "../api/client";
import { navigate } from "../router/HashRouter";

/**
 * PUBLIC_INTERFACE
 * New request form - queues when offline
 */
export default function NewRequest() {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [desc, setDesc] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await mutate("POST", "/requests", { title, priority, desc });
    if (res.queued) {
      alert("No network. Request queued for sync.");
    } else {
      alert("Request created.");
    }
    navigate("/requests");
  };

  return (
    <div>
      <div className="page-header">
        <h1>New Service Request</h1>
      </div>
      <Card>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 16 }}>
          <Input label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
          <Select label="Priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </Select>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Description</span>
            <textarea className="input" rows={6} value={desc} onChange={(e) => setDesc(e.target.value)} />
          </label>
          <div>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
