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

/**
 * PUBLIC_INTERFACE
 * HashRouter component renders the first matching route for location.hash.
 * Routes: [{ path: '/customers', component: Customers }, ...]
 */
export function HashRouter({ routes, notFound: NotFound }) {
  const current = useHashPath();
  const routeMatch = useMemo(() => {
    for (const route of routes) {
      const m = matchPath(route.path, current);
      if (m) return { component: route.component, params: m.params, path: route.path };
    }
    return null;
  }, [routes, current]);

  if (routeMatch) {
    const Cmp = routeMatch.component;
    return <Cmp params={routeMatch.params} path={routeMatch.path} />;
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

/* Hook: get current hash path without '#' */
function useHashPath() {
  const getPath = () => {
    const h = window.location.hash || "#/";
    const raw = h.startsWith("#") ? h.slice(1) : h;
    return raw || "/";
  };
  const [path, setPath] = useState(getPath());

  useEffect(() => {
    const onChange = () => setPath(getPath());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return path;
}
