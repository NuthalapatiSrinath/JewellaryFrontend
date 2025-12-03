import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./EnhancedDynamicTable.module.css";

/**
 * Props:
 * - headings: [{ title, accessor, cell? }]
 * - columnData: array of rows (each row should have an `id` and `slug`)
 *
 * Behavior:
 * - Clicking "VIEW ▾" expands an inline details panel under the row.
 * - Clicking "CLOSE ▴" collapses the panel.
 * - "VIEW MORE DETAILS" navigates to /collection-product/:slug
 */
export default function EnhancedDynamicTable({
  headings = [],
  columnData = [],
}) {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);
  const colCount = Math.max(1, headings.length);

  const toggle = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
    setTimeout(() => {
      const el = document.getElementById(`row-${id}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
  };

  const handleAddToCart = (row) => {
    navigate("/cart", { state: { add: row.id } });
  };

  const handleAddToRing = (row) => {
    navigate("/engagement", { state: { add: row.id } });
  };

  const handleViewMore = (row) => {
    // Navigate to CollectionProductDetail page (your route)
    navigate(`/collection-product/${row.slug}`);
  };

  return (
    <div className={styles.outer}>
      <div className={styles.tableWrapper}>
        <table
          className={styles.table}
          role="table"
          aria-label="Gemstone results table"
        >
          <thead>
            <tr>
              {headings.map((h, i) => (
                <th key={i} scope="col" className={styles.th}>
                  {h.title}
                </th>
              ))}
              <th className={styles.th} /> {/* actions column */}
            </tr>
          </thead>

          <tbody>
            {columnData.map((row, idx) => {
              const rid = row.id ?? idx;
              const isOpen = expandedId === rid;
              return (
                <React.Fragment key={rid}>
                  <tr id={`row-${rid}`} className={styles.tr}>
                    {headings.map((h, ci) => (
                      <td key={ci} className={styles.td}>
                        {h.cell
                          ? h.cell(row[h.accessor], row)
                          : row[h.accessor] ?? ""}
                      </td>
                    ))}
                    <td className={styles.tdActions}>
                      <button
                        className={styles.viewBtn}
                        onClick={() => toggle(rid)}
                        aria-expanded={isOpen}
                        aria-controls={`details-${rid}`}
                      >
                        {isOpen ? "CLOSE ▴" : "VIEW ▾"}
                      </button>
                    </td>
                  </tr>

                  {isOpen && (
                    <tr className={styles.detailRow} id={`details-${rid}`}>
                      <td className={styles.detailCell} colSpan={colCount + 1}>
                        <div className={styles.detailInner}>
                          <div className={styles.detailLeft}>
                            {row.thumb ? (
                              <img
                                src={row.thumb}
                                alt={row.title ?? row.slug}
                                className={styles.detailThumb}
                              />
                            ) : (
                              <div className={styles.detailThumbPlaceholder} />
                            )}
                          </div>

                          <div className={styles.detailBody}>
                            <h3 className={styles.detailTitle}>
                              {row.title ?? row.slug}
                            </h3>

                            <a className={styles.helpLink} href="/contact">
                              <em>Need help? Talk to an expert.</em>
                            </a>

                            <div className={styles.metaGrid}>
                              <div className={styles.metaCol}>
                                <div>
                                  <strong>PRICE:</strong> {row.price}
                                </div>
                                <div>
                                  <strong>SKU:</strong> {row.sku ?? "-"}
                                </div>
                                <div>
                                  <strong>CARAT:</strong> {row.carat}
                                </div>
                              </div>

                              <div className={styles.metaCol}>
                                <div>
                                  <strong>COLOR:</strong> {row.color ?? "-"}
                                </div>
                                <div>
                                  <strong>SHAPE:</strong> {row.shape ?? "-"}
                                </div>
                                <div>
                                  <strong>MEASUREMENT:</strong>{" "}
                                  {row.measurement ?? "-"}
                                </div>
                              </div>
                            </div>

                            <button
                              className={styles.moreDetailsBtn}
                              onClick={() => handleViewMore(row)}
                            >
                              VIEW MORE DETAILS
                            </button>
                          </div>

                          <div className={styles.detailActions}>
                            <button
                              className={styles.addToCart}
                              onClick={() => handleAddToCart(row)}
                            >
                              ADD TO CART
                            </button>
                            <button
                              className={styles.addToRing}
                              onClick={() => handleAddToRing(row)}
                            >
                              ADD TO RING
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
