import React, { useEffect, useMemo, useState } from "react";

/**
 * Simple pattern match supporting /path, /path/:id, and nested segments.
 * Returns { params } if matched, null otherwise.
 */
function matchPath(pattern, path) {
  const pSegs = pattern.replace(/^\/+|\/+$/g, "").split("/");
  const pathSegs = path.replace(/^\/+|\/+$/g, "").split("/");

  if (pattern === "*") return { params: {} };
  if (pSegs.length !== pathSegs.length) return null;

  const params = {};
  for (let i = 0; i < pSegs.length; i++) {
    const p = pSegs[i];
    const s = pathSegs[i];
    if (p.startsWith(":")) {
      params[p.slice(1)] = decodeURIComponent(s);
    } else if (p !== s) {
      return null;
    }
  }
  return { params };
}

function parseHash() {
  const h = window.location.hash || "#/";
  const raw = h.startsWith("#") ? h.slice(1) : h;
  const [pathnameOnly, qs = ""] = raw.split("?");
  const query = {};
  if (qs) {
    const usp = new URLSearchParams(qs);
    for (const [k, v] of usp.entries()) {
      query[k] = v;
    }
  }
  const path = pathnameOnly || "/";
  return { path, query, full: raw };
}

/**
 * PUBLIC_INTERFACE
 * HashRouter component renders the first matching route for location.hash.
 * Routes: [{ path: '/customers', component: Customers }, ...]
 */
export function HashRouter({ routes, notFound: NotFound }) {
  const { path, query } = useHashLocation();
  const routeMatch = useMemo(() => {
    for (const route of routes) {
      const m = matchPath(route.path, path);
      if (m) return { component: route.component, params: m.params, path: route.path };
    }
    return null;
  }, [routes, path]);

  if (routeMatch) {
    const Cmp = routeMatch.component;
    return <Cmp params={routeMatch.params} path={routeMatch.path} query={query} />;
  }
  return NotFound ? <NotFound /> : null;
}

/**
 * PUBLIC_INTERFACE
 * Link component for hash routing.
 */
export function Link({ to, children, className = "", ...rest }) {
  const href = to.startsWith("#") ? to : `#${to}`;
  return (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  );
}

/**
 * PUBLIC_INTERFACE
 * Programmatic navigation
 */
export function navigate(to) {
  const hash = to.startsWith("#") ? to : `#${to}`;
  if (window.location.hash !== hash) {
    window.location.hash = hash;
  } else {
    // Force hashchange for same hash navigation
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }
}

/* Hook: get current hash path/query without '#' */
function useHashLocation() {
  const getLoc = () => parseHash();
  const [loc, setLoc] = useState(getLoc());

  useEffect(() => {
    const onChange = () => setLoc(getLoc());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return loc;
}
