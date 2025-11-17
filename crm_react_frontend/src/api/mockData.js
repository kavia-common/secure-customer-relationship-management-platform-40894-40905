export const customers = [
  { id: "CUST-1001", name: "Acme Corp", segment: "Enterprise", owner: "Jane Smith", email: "ops@acme.com", phone: "+1 202 555 0147", city: "New York", score: 86 },
  { id: "CUST-1002", name: "Globex Inc", segment: "Mid-Market", owner: "John Doe", email: "contact@globex.com", phone: "+1 415 555 0199", city: "San Francisco", score: 74 },
  { id: "CUST-1003", name: "Soylent", segment: "SMB", owner: "Mary Johnson", email: "hello@soylent.com", phone: "+1 303 555 0129", city: "Denver", score: 62 },
];

export const requests = [
  { id: "REQ-3001", customerId: "CUST-1001", title: "Billing discrepancy Q1", status: "Open", priority: "High", createdAt: "2025-01-12", owner: "Agent 1" },
  { id: "REQ-3002", customerId: "CUST-1002", title: "Password reset", status: "Closed", priority: "Low", createdAt: "2025-02-03", owner: "Agent 2" },
  { id: "REQ-3003", customerId: "CUST-1001", title: "Onboarding help", status: "Pending", priority: "Medium", createdAt: "2025-02-18", owner: "Agent 3" },
];

export const complaints = [
  { id: "CMP-5001", customerId: "CUST-1003", title: "Service outage report", severity: "Critical", status: "Investigating", createdAt: "2025-02-22" },
];

export const auditLogs = [
  { id: "AUD-7001", actor: "admin@corp", action: "LOGIN", details: "Successful login", at: "2025-03-12 09:11" },
  { id: "AUD-7002", actor: "jane@corp", action: "CREATE_REQUEST", details: "REQ-3004", at: "2025-03-12 10:45" },
];
