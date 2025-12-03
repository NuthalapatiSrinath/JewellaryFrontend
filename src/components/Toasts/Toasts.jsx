import React from "react";
import { createPortal } from "react-dom";
import styles from "./Toasts.module.css";

export default function Toasts() {
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    const onShow = (e) => {
      const id = Math.random().toString(36).slice(2);
      const msg = e.detail?.message || "";
      setItems((prev) => [...prev, { id, msg }]);
      setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== id));
      }, 2500);
    };
    window.addEventListener("toast:show", onShow);
    return () => window.removeEventListener("toast:show", onShow);
  }, []);

  return createPortal(
    <div className={styles.container}>
      {items.map((t) => (
        <div key={t.id} className={styles.toast}>
          {t.msg}
        </div>
      ))}
    </div>,
    document.body
  );
}
