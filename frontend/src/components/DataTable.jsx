function DataTable({ columns, rows, emptyMessage = 'Nenhum registro encontrado.', title }) {
  if (!rows.length) {
    return (
      <div className="empty-state" role="status">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table aria-label={title}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td data-label={column.label} key={column.key}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
