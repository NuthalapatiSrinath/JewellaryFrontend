import React, { useMemo, useState } from "react";
import styles from "./BlogCard.module.css";

/**
 * BlogCard
 * Props:
 *  - image (string)              required
 *  - title (string)              required
 *  - date (string)
 *  - excerpt (string)            optional (short preview)
 *  - moreText (string)           optional (explicit extra content)
 *  - content (string)            optional (full text; will be auto-split)
 *  - truncateAt (number)         optional threshold for auto split (default 220)
 *  - initialOpen (boolean)
 *  - onToggle (fn)
 *
 * Priority:
 *   If `moreText` provided -> use (excerpt + moreText)
 *   else if `content` provided -> auto split by `truncateAt`
 *   else -> show `excerpt` only (no read more)
 */
export default function BlogCard({
  image,
  title,
  date,
  excerpt = "",
  moreText = "",
  content = "",
  truncateAt = 220,
  initialOpen = false,
  onToggle,
}) {
  const [open, setOpen] = useState(initialOpen);

  const { preview, rest } = useMemo(() => {
    // explicit moreText wins
    if (moreText) return { preview: excerpt, rest: moreText };

    // auto split long content OR long excerpt
    const base = content || excerpt || "";
    if (!base) return { preview: "", rest: "" };

    // normalize whitespace
    const txt = base.replace(/\s+/g, " ").trim();

    if (txt.length <= truncateAt) {
      // short enough: show as preview only
      // if content came in (no excerpt), don't duplicate
      if (content && !excerpt) return { preview: txt, rest: "" };
      return { preview: excerpt || txt, rest: "" };
    }

    // split at nearest word boundary before truncateAt
    let cut = truncateAt;
    const space = txt.lastIndexOf(" ", truncateAt);
    if (space > truncateAt * 0.6) cut = space;

    return {
      preview: txt.slice(0, cut).trim() + "…",
      rest: txt.slice(cut).trim(),
    };
  }, [excerpt, moreText, content, truncateAt]);

  const hasMore = Boolean(rest);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    onToggle && onToggle(next);
  };

  return (
    <article className={styles.card}>
      <div className={styles.mediaWrap}>
        <img className={styles.image} src={image} alt={title} loading="lazy" />
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        {date && <p className={styles.meta}>{date}</p>}

        {preview && <p className={styles.excerpt}>{preview}</p>}

        {hasMore && (
          <div
            className={`${styles.more} ${open ? styles.open : ""}`}
            aria-hidden={!open}
          >
            <p>{rest}</p>
          </div>
        )}

        {hasMore && (
          <button
            type="button"
            className={styles.readMore}
            onClick={toggle}
            aria-expanded={open}
          >
            {open ? "Read Less" : "Read More"}
          </button>
        )}
      </div>
    </article>
  );
}
