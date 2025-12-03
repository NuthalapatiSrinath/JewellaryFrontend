import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { closeModal } from "../../redux/slices/modalSlice";
import styles from "./ViewDetailsModal.module.css";

export default function ViewDetailsModal({ open, onClose, data }) {
  const dispatch = useDispatch();

  // Close modal when ESC pressed
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") dispatch(closeModal());
    };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, dispatch]);

  if (!open) return null;

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      onMouseDown={() => dispatch(closeModal())}
    >
      <motion.div
        className={styles.sheet}
        onMouseDown={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Product Details</h2>
          <button
            className={styles.closeBtn}
            onClick={() => dispatch(closeModal())}
          >
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <h3>{data?.title}</h3>
          <p>{data?.subtitle}</p>
          <div className={styles.info}>
            <div>
              <strong>Price:</strong> {data?.price}
            </div>
            <div>
              <strong>Variants:</strong>{" "}
              {Object.keys(data?.variants || {}).join(", ")}
            </div>
            <div>
              <strong>Default color:</strong> {data?.defaultColor}
            </div>
          </div>

          <div className={styles.imageGrid}>
            {Object.values(data?.variants || {})
              .slice(0, 4)
              .map((src, i) => (
                <img key={i} src={src} alt={`${data?.title} ${i}`} />
              ))}
          </div>
        </div>

        <div className={styles.footer}>
          <button onClick={() => dispatch(closeModal())}>Close</button>
        </div>
      </motion.div>
    </div>
  );
}
