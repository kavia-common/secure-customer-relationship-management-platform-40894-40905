let dispatchRef = null;

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";
const QUEUE_KEY = "crm_offline_queue_v1";

/**
 * PUBLIC_INTERFACE
 * setDispatch allows API client to inform global state about queue changes.
 */
export function setDispatch(dispatch) {
  dispatchRef = dispatch;
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

/**
 * PUBLIC_INTERFACE
 * get - performs a GET with graceful failure fallback
 */
export async function get(path) {
  try {
    const res = await fetch(safeJoin(API_BASE, path), { credentials: "include" });
    if (!res.ok) throw new Error(`GET ${path} failed with ${res.status}`);
    return await res.json();
  } catch (e) {
    // Allow caller to handle fallback. Re-throw to distinguish.
    throw e;
  }
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
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });
    if (!res.ok) throw new Error(`${method} ${path} failed ${res.status}`);
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
        headers: { "Content-Type": "application/json" },
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

function safeJoin(base, path) {
  if (!path.startsWith("/")) return `${base}/${path}`;
  return `${base}${path}`;
}
