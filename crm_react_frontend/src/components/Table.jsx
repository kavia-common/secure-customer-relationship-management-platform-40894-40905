import React from "react";

/**
 * PUBLIC_INTERFACE
 * Table component
 */
export default function Table({ columns, data, onRowClick }) {
  return (
    <table className="table" role="table">
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key} role="columnheader">{c.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={row.id || idx} role="row" onClick={() => onRowClick && onRowClick(row)} style={{ cursor: onRowClick ? "pointer" : "auto" }}>
            {columns.map((c) => (
              <td key={c.key} role="cell">{c.render ? c.render(row[c.key], row) : row[c.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
