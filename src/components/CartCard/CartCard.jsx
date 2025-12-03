import React from "react";
import styles from "./CartCard.module.css";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/modalSlice";

export default function CartCard({
  id,
  img,
  title,
  price,
  qty = 1,
  onQtyChange = () => {},
  onRemove,
}) {
  const dispatch = useDispatch();
  const subtotal = (price || 0) * (qty || 1);

  const inc = () => onQtyChange(Math.max(1, qty + 1));
  const dec = () => onQtyChange(Math.max(1, qty - 1));

  const handleDelete = () => {
    if (onRemove) {
      onRemove(id);
      return;
    }

    dispatch(
      openModal({
        type: "confirmRemoveModal",
        data: { id, title, price, onConfirm: () => onRemove && onRemove(id) },
      })
    );
  };

  return (
    <div className={styles.card}>
      <img src={img} alt={title} className={styles.thumb} />

      <div className={styles.details}>
        <div className={styles.title}>{title}</div>

        <div className={styles.quantityRow}>
          <span className={styles.qtyLabel}>Quantity</span>
          <div className={styles.qtyWrap}>
            <span className={styles.qtyNum}>{qty}</span>
            <div className={styles.stepper}>
              <button onClick={inc} aria-label="Increase">
                <FiChevronUp />
              </button>
              <button onClick={dec} aria-label="Decrease">
                <FiChevronDown />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.price}>${subtotal.toLocaleString()}</div>
      </div>

      <button
        className={styles.deleteBtn}
        onClick={handleDelete}
        aria-label="Remove item"
      >
        <FaTrash />
      </button>
    </div>
  );
}
