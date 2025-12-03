import React, { useEffect, useRef } from "react";
import styles from "./ConfirmRemoveModal.module.css";
import Button from "../../components/Button/Button";

const ConfirmRemoveModal = ({
  title = "Remove 1 Item",
  message = "Are You Sure Want To Remove 1 Item From Bag.",
  onConfirm,
  onMoveToWishlist,
  onClose,
  visible = false,
}) => {
  const closeRef = useRef(null);

  useEffect(() => {
    if (visible && closeRef.current) closeRef.current.focus();
  }, [visible]);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose?.();
    if (visible) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h4 className={styles.modalTitle}>{title}</h4>
          <button
            ref={closeRef}
            className={styles.modalClose}
            aria-label="Close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className={styles.modalBody}>{message}</div>

        <div className={styles.modalActions}>
          <Button
            label="Remove"
            bgColor="#fff"
            textColor="#993399"
            borderColor="#993399"
            width="100%"
            height="56px"
            borderRadius="14px"
            fontSize="18px"
            fontWeight="600"
            onClick={onConfirm}
          />
          <Button
            label="Move To Wishlist"
            bgColor="#993399"
            textColor="#ffffff"
            borderColor="#993399"
            width="100%"
            height="56px"
            borderRadius="14px"
            fontSize="18px"
            fontWeight="600"
            onClick={onMoveToWishlist}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmRemoveModal;
