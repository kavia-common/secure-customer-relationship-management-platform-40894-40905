import React from "react";

/**
 * PUBLIC_INTERFACE
 * Pagination
 */
export default function Pagination({ page, totalPages, onPage }) {
  return (
    <div className="pagination">
      <button className="btn ghost" onClick={() => onPage(1)} disabled={page === 1} aria-label="First">⏮</button>
      <button className="btn ghost" onClick={() => onPage(page - 1)} disabled={page === 1} aria-label="Previous">◀</button>
      <span>Page {page} of {totalPages}</span>
      <button className="btn ghost" onClick={() => onPage(page + 1)} disabled={page === totalPages} aria-label="Next">▶</button>
      <button className="btn ghost" onClick={() => onPage(totalPages)} disabled={page === totalPages} aria-label="Last">⏭</button>
    </div>
  );
}
