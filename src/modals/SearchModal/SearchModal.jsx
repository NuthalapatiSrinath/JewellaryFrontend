import React from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import styles from "./SearchModal.module.css";

/* ---------------------------------------------
   LocalStorage-backed recent searches (write-through)
---------------------------------------------- */
const STORAGE_KEY = "arra_recent_searches";
const clamp = (arr, max = 8) => (Array.isArray(arr) ? arr.slice(0, max) : []);

function useRecent(max = 8) {
  const [recent, setRecent] = React.useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = JSON.parse(raw || "[]");
      return clamp(Array.isArray(parsed) ? parsed : [], max);
    } catch {
      return [];
    }
  });

  const addRecent = React.useCallback(
    (q) => {
      const s = (q || "").trim();
      if (!s) return;
      const next = clamp(
        [s, ...recent.filter((x) => x.toLowerCase() !== s.toLowerCase())],
        max
      );
      setRecent(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
    },
    [recent, max]
  );

  const removeRecent = React.useCallback(
    (q) => {
      const next = recent.filter((x) => x.toLowerCase() !== q.toLowerCase());
      setRecent(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
    },
    [recent]
  );

  const clearRecent = React.useCallback(() => {
    setRecent([]);
    try {
      localStorage.setItem(STORAGE_KEY, "[]");
    } catch {}
  }, []);

  return { recent, addRecent, removeRecent, clearRecent };
}

/* ---------------------------------------------
   Search Modal
---------------------------------------------- */
export default function SearchModal({
  open,
  onClose,
  position = "top", // "top" | "center"
  topOffset = 80, // px from top when position="top"
}) {
  const navigate = useNavigate();
  const { recent, addRecent, removeRecent, clearRecent } = useRecent(8);
  const [query, setQuery] = React.useState("");

  // close on Esc
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const go = (q) => {
    const s = (q ?? query).trim();
    if (!s) return;
    addRecent(s); // write-through immediately (persists even if navigating)
    navigate(`/search?q=${encodeURIComponent(s)}`);
    onClose?.();
  };

  if (!open) return null;

  return createPortal(
    <>
      <div className={styles.overlay} onClick={onClose} />

      <div
        className={`${styles.modal} ${
          position === "top" ? styles.top : styles.center
        }`}
        style={position === "top" ? { marginTop: topOffset } : undefined}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.row}>
          <div className={styles.inputShell}>
            <span className={styles.searchIcon} aria-hidden>
              🔍
            </span>
            <input
              className={styles.input}
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && go()}
              autoFocus
            />
          </div>

          <button
            type="button"
            className={styles.cta}
            onClick={() => go()}
            aria-label="Search"
          >
            Search
          </button>
        </div>

        <div className={styles.recentHeader}>
          <span>Recent Searches</span>
          {recent.length > 0 && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={clearRecent}
              aria-label="Clear recent searches"
            >
              Clear
            </button>
          )}
        </div>

        {recent.length === 0 ? (
          <div className={styles.empty}>No recent searches yet.</div>
        ) : (
          <div className={styles.chips} role="list">
            {recent.map((term) => (
              <div key={term} className={styles.chip} role="listitem">
                <button
                  type="button"
                  className={styles.chipLabel}
                  onClick={() => go(term)}
                  title={`Search "${term}"`}
                >
                  {term}
                </button>
                <button
                  type="button"
                  className={styles.chipX}
                  onClick={() => removeRecent(term)}
                  aria-label={`Remove ${term}`}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>,
    document.body
  );
}
