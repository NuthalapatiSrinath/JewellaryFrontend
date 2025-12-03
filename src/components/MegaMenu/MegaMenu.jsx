// components/MegaMenu/MegaMenu.jsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "./MegaMenu.module.css";

/**
 * props:
 * - id (string) : unique id for aria
 * - triggerLabel (string)
 * - columns (array of { title, items: [{ label, to, icon }] })
 * - image: { src, alt, ctaLabel, ctaTo }
 */
export default function MegaMenu({ id, triggerLabel, columns = [], image }) {
  return (
    <li className={styles.navLiWithPanel} aria-haspopup="true" aria-owns={id}>
      {/* trigger is just slot for a NavLink in Topbar; we expect Topbar to render NavLink and this component next to it */}
      <div
        className={styles.panelWrap}
        id={id}
        role="region"
        aria-label={`${triggerLabel} menu`}
      >
        <div className={styles.megaPanel}>
          <div className={styles.megaInner}>
            {columns.map((col, idx) => (
              <div className={styles.column} key={idx}>
                {col.title && <h4>{col.title}</h4>}
                <ul>
                  {col.items.map((it, i) => (
                    <li key={i}>
                      <Link to={it.to}>
                        {it.icon && (
                          <img
                            src={it.icon}
                            alt=""
                            aria-hidden="true"
                            className={styles.itemIcon}
                          />
                        )}
                        <span className={styles.itemLabel}>{it.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {image && (
              <div className={styles.panelImage}>
                <img src={image.src} alt={image.alt} />
                {image.ctaLabel && (
                  <Link to={image.ctaTo || "#"} className={styles.panelCta}>
                    {image.ctaLabel}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
