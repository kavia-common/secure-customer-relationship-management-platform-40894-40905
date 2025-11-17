import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { Input, Select } from "../components/Input";
import Button from "../components/Button";
import { get, mutate } from "../api/client";
import { navigate } from "../router/HashRouter";
import { customers as mockCustomers } from "../api/mockData";

/**
 * PUBLIC_INTERFACE
 * New request form - queues when offline and aligns with backend schema
 */
export default function NewRequest() {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [desc, setDesc] = useState("");
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await get("/customers");
        setCustomers(data || []);
        if ((data || []).length > 0) setCustomerId(String(data[0].id));
      } catch {
        setCustomers(mockCustomers.map((c, idx) => ({ id: idx + 1, name: c.name })));
        setCustomerId("1");
      }
    })();
  }, []);

  const mapPriority = (p) => {
    if (p === "Low") return "low";
    if (p === "High") return "high";
    return "normal";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      customer_id: Number(customerId),
      subject: title,
      description: desc,
      priority: mapPriority(priority),
    };
    const res = await mutate("POST", "/requests", payload);
    if (res.queued) {
      alert("No network. Request queued for sync.");
      navigate("/requests");
    } else if (res && res.id) {
      alert("Request created.");
      navigate(`/requests/${res.id}`);
    } else {
      alert("Submitted.");
      navigate("/requests");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>New Service Request</h1>
      </div>
      <Card>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 16 }}>
          <Select label="Customer" value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
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
