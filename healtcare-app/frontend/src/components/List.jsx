import React from 'react'
export default function List({ items, columns, onDelete }) {
  const rows = Array.isArray(items) ? items : [];
  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map(c => <th key={c}>{c}</th>)}
          {onDelete && <th/>}
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.id}>
            {columns.map(c => <td key={c}>{String(row[c] ?? '')}</td>)}
            {onDelete && <td><button className="btn btn-ghost" onClick={()=>onDelete(row.id)}>Elimina</button></td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
