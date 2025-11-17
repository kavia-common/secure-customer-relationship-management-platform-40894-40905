let dispatchRef = null;

export const TOKEN_KEY = "crm_auth_token_v1";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";
const QUEUE_KEY = "crm_offline_queue_v1";

/**
 * PUBLIC_INTERFACE
 * setDispatch allows API client to inform global state about queue changes.
 */
export function setDispatch(dispatch) {
  dispatchRef = dispatch;
}

/**
 * PUBLIC_INTERFACE
 * getAuthToken - returns the current auth token from storage
 */
export function getAuthToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || null;
  } catch {
    return null;
  }
}

/**
 * PUBLIC_INTERFACE
 * setAuthToken - update/remove the auth token in localStorage
 */
export function setAuthToken(token) {
  try {
    if (!token) {
      localStorage.removeItem(TOKEN_KEY);
    } else {
      localStorage.setItem(TOKEN_KEY, token);
    }
  } catch {
    // ignore storage errors
  }
}

/* Queue helpers */
function loadQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveQueue(q) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
  dispatchRef && dispatchRef({ type: "QUEUE_SET", payload: q });
}

function authHeaders(extra = {}) {
  const t = getAuthToken();
  const base = t ? { Authorization: `Bearer ${t}` } : {};
  return { ...base, ...extra };
}

function safeJoin(base, path) {
  if (!path.startsWith("/")) return `${base}/${path}`;
  return `${base}${path}`;
}

function toQueryString(params) {
  if (!params) return "";
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && String(v) !== ""
  );
  const usp = new URLSearchParams();
  for (const [k, v] of entries) {
    usp.set(k, String(v));
  }
  const qs = usp.toString();
  return qs ? `?${qs}` : "";
}

function redirectIfUnauthorized(status) {
  if (status === 401) {
    try {
      // Directly update hash to avoid circular import of navigate()
      if (typeof window !== "undefined") {
        window.location.hash = "#/login";
      }
    } catch {
      // ignore
    }
  }
}

/**
 * PUBLIC_INTERFACE
 * get - performs a GET with auth header and graceful failure fallback
 * If params is provided, it will be appended as a query string.
 */
export async function get(path, params = undefined) {
  const url = safeJoin(API_BASE, path) + toQueryString(params);
  try {
    const res = await fetch(url, {
      credentials: "include",
      headers: authHeaders(),
    });
    if (!res.ok) {
      redirectIfUnauthorized(res.status);
      let msg = `GET ${path} failed with ${res.status}`;
      try {
        const j = await res.json();
        if (j && j.detail) msg += `: ${JSON.stringify(j.detail)}`;
      } catch {
        // ignore parse
      }
      throw new Error(msg);
    }
    return await res.json();
  } catch (e) {
    throw e;
  }
}

/**
 * PUBLIC_INTERFACE
 * post - standard POST (no queue). For auth or non-idempotent calls where queueing isn't desired.
 */
export async function post(path, body) {
  const url = safeJoin(API_BASE, path);
  const res = await fetch(url, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  if (!res.ok) {
    redirectIfUnauthorized(res.status);
    let msg = `POST ${path} failed ${res.status}`;
    try {
      const j = await res.json();
      if (j && j.detail) msg += `: ${JSON.stringify(j.detail)}`;
    } catch {
      // ignore parse error
    }
    throw new Error(msg);
  }
  return await res.json().catch(() => ({}));
}

/**
 * PUBLIC_INTERFACE
 * mutate - for POST/PUT/DELETE. Queues when offline or on failure.
 */
export async function mutate(method, path, body) {
  const payload = { method, path, body, ts: Date.now() };
  if (!navigator.onLine) {
    enqueue(payload);
    return { queued: true };
  }
  try {
    const res = await fetch(safeJoin(API_BASE, path), {
      method,
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });
    if (!res.ok) {
      redirectIfUnauthorized(res.status);
      throw new Error(`${method} ${path} failed ${res.status}`);
    }
    return await res.json().catch(() => ({}));
  } catch (e) {
    enqueue(payload);
    return { queued: true, error: e.message };
  }
}

/**
 * PUBLIC_INTERFACE
 * syncQueue - attempt to flush queued operations
 */
export async function syncQueue() {
  const q = loadQueue();
  if (q.length === 0) return { synced: 0 };
  const remaining = [];
  let synced = 0;

  for (const item of q) {
    try {
      const res = await fetch(safeJoin(API_BASE, item.path), {
        method: item.method,
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: item.body ? JSON.stringify(item.body) : undefined,
        credentials: "include",
      });
      if (!res.ok) throw new Error("bad status");
      synced++;
    } catch {
      remaining.push(item);
    }
  }
  saveQueue(remaining);
  return { synced, remaining: remaining.length };
}

/**
 * PUBLIC_INTERFACE
 * getQueue - returns the current queue
 */
export function getQueue() {
  return loadQueue();
}

/* internal helpers */
function enqueue(item) {
  const q = loadQueue();
  q.push(item);
  saveQueue(q);
}

/**
 * PUBLIC_INTERFACE
 * getCustomers - list customers with pagination and query
 * Returns either:
 *  - { items, total, page, page_size } (preferred)
 *  - or a plain array of CustomerOut (legacy)
 */
export async function getCustomers(params = {}) {
  const data = await get("/customers", params);
  if (Array.isArray(data)) {
    return { items: data, total: data.length, page: Number(params.page || 1), page_size: Number(params.page_size || data.length || 50) };
  }
  return data;
}

/**
 * PUBLIC_INTERFACE
 * getCustomerById - fetch a single customer detail
 */
export async function getCustomerById(id) {
  return await get(`/customers/${id}`);
}
