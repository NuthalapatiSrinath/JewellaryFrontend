import styles from "./DynamicTable.module.css";

function DynamicTable({ headings = [], columnData = [] }) {
  return (
    <div className={styles.outerWrapper}>
      <div className={styles.tableWrapper}>
        <table className={styles.Dynamic}>
          <thead>
            <tr>
              {headings.map((heading, index) => (
                <td key={index}>{heading.title}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {columnData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headings.map((heading, colIndex) => (
                  <td key={colIndex}>
                    {
                      heading.cell
                        ? heading.cell(row[heading.accessor], row) // ✅ Use custom cell if provided
                        : row[heading.accessor] ?? "" // fallback if missing
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DynamicTable;
