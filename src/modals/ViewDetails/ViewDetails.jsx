// src/modals/ViewDetailsModal/ViewDetails.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./ViewDetails.module.css";

/**
 * Props:
 * - open: boolean
 * - onClose: fn
 * - data: product object (id, slug, title, price, sku, carat, color, shape, measurement, thumb, etc)
 */
export default function ViewDetails({
  open = false,
  onClose = () => {},
  data = {},
}) {
  const navigate = useNavigate();
  if (!open) return null;

  const handleAddToCart = () => {
    navigate("/cart", { state: { add: data.id } });
    onClose();
  };

  const handleAddToRing = () => {
    navigate("/engagement", { state: { add: data.id } });
    onClose();
  };

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <motion.div
        className={styles.modal}
        initial={{ opacity: 0, y: 8, scale: 0.995 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.995 }}
        transition={{ duration: 0.18 }}
      >
        <header className={styles.header}>
          <h2 className={styles.title}>{data.title ?? data.slug}</h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close details"
          >
            CLOSE ▴
          </button>
        </header>

        <div className={styles.body}>
          <div className={styles.left}>
            {data.thumb ? (
              <img
                src={data.thumb}
                alt={data.title ?? "gemstone"}
                className={styles.thumb}
              />
            ) : (
              <div className={styles.thumbPlaceholder} />
            )}
          </div>

          <div className={styles.center}>
            <div className={styles.metaRow}>
              <div className={styles.metaLabel}>PRICE:</div>
              <div className={styles.metaValue}>{data.price ?? "-"}</div>
            </div>

            <div className={styles.metaRow}>
              <div className={styles.metaLabel}>SKU:</div>
              <div className={styles.metaValue}>{data.sku ?? "-"}</div>
            </div>

            <div className={styles.metaRow}>
              <div className={styles.metaLabel}>CARAT:</div>
              <div className={styles.metaValue}>{data.carat ?? "-"}</div>
            </div>

            <a
              className={styles.moreLink}
              href={`/products/${data.slug}`}
              target="_blank"
              rel="noreferrer"
            >
              VIEW MORE DETAILS
            </a>
          </div>

          <aside className={styles.right}>
            <div className={styles.attribRow}>
              <span className={styles.attribLabel}>COLOR:</span>
              <span className={styles.attribValue}>{data.color ?? "-"}</span>
            </div>

            <div className={styles.attribRow}>
              <span className={styles.attribLabel}>SHAPE:</span>
              <span className={styles.attribValue}>{data.shape ?? "-"}</span>
            </div>

            <div className={styles.attribRow}>
              <span className={styles.attribLabel}>MEASUREMENT:</span>
              <span className={styles.attribValue}>
                {data.measurement ?? "-"}
              </span>
            </div>

            <div className={styles.ctaRow}>
              <button className={styles.addCart} onClick={handleAddToCart}>
                ADD TO CART
              </button>
              <button className={styles.addRing} onClick={handleAddToRing}>
                ADD TO RING
              </button>
            </div>
          </aside>
        </div>
      </motion.div>
    </div>
  );
}
