import React from "react";

/**
 * PUBLIC_INTERFACE
 * Table component with optional loading and empty states.
 */
export default function Table({ columns, data, onRowClick, loading = false, emptyMessage = "No results found." }) {
  const colSpan = columns?.length || 1;
  return (
    <table className="table" role="table" aria-busy={loading ? "true" : "false"}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key} role="columnheader">{c.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={colSpan} role="cell">
              <span className="text-muted">Loading…</span>
            </td>
          </tr>
        ) : data.length === 0 ? (
          <tr>
            <td colSpan={colSpan} role="cell">
              <span className="text-muted">{emptyMessage}</span>
            </td>
          </tr>
        ) : (
          data.map((row, idx) => (
            <tr
              key={row.id || idx}
              role="row"
              onClick={() => onRowClick && onRowClick(row)}
              style={{ cursor: onRowClick ? "pointer" : "auto" }}
            >
              {columns.map((c) => (
                <td key={c.key} role="cell">
                  {c.render ? c.render(row[c.key], row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
