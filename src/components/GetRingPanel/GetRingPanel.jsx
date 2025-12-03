import React from "react";
import styles from "./GetRingPanel.module.css";

/**
 * Standalone panel showing:
 *  - Ships by <date> (neutral gray icon)
 *  - Heading "Your order includes"
 *  - Free Shipping (colorful)
 *  - Free Returns (colorful)
 *
 * Props:
 *  - shipByDate: optional string (if missing uses a computed 3-business-day label)
 */
export default function GetRingPanel({ shipByDate }) {
  // small helper to compute a localized ship-by date if none provided
  const addBusinessDays = (date, days) => {
    const result = new Date(date);
    let added = 0;
    while (added < days) {
      result.setDate(result.getDate() + 1);
      const day = result.getDay();
      if (day !== 0 && day !== 6) added++;
    }
    return result;
  };
  const formatShipDate = (d) =>
    d.toLocaleDateString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "short",
    });

  const computedShipBy =
    shipByDate || formatShipDate(addBusinessDays(new Date(), 3));

  return (
    <div className={styles.container} aria-label="Order includes panel">
      <div className={styles.neutralRow}>
        <div className={styles.neutralIcon} aria-hidden>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            role="img"
            aria-hidden
          >
            <path
              d="M3 7h13v8H3z"
              fill="none"
              stroke="#9b9b9b"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 10h4l1 2v3"
              stroke="#9b9b9b"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="7.5" cy="17.5" r="1.6" fill="#9b9b9b" />
            <circle cx="18.5" cy="17.5" r="1.6" fill="#9b9b9b" />
          </svg>
        </div>
        <div className={styles.neutralContent}>
          <div className={styles.neutralTitle}>Ships by {computedShipBy}</div>
        </div>
      </div>

      <div className={styles.featuresHeading}>Your order includes</div>

      <div className={styles.featuresList}>
        <div className={styles.featureItem}>
          <div className={styles.featureIcon} aria-hidden>
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              role="img"
              aria-hidden
            >
              <circle cx="12" cy="12" r="11" />
              <path
                d="M3 13h11v-4H3v4zM14 13h5l2 3v2h-2a1 1 0 0 1-2 0h-6"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className={styles.featureContent}>
            <div className={styles.featureTitle}>Free Shipping</div>
            <div className={styles.featureDesc}>
              We’re committed to making your entire experience a pleasant one,
              from shopping to shipping.
            </div>
          </div>
        </div>

        <div className={styles.featureItem}>
          <div className={styles.featureIcon} aria-hidden>
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              role="img"
              aria-hidden
            >
              <circle cx="12" cy="12" r="11" />
              <path
                d="M20 12v5a1 1 0 0 1-1 1h-3"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 12v-5a1 1 0 0 1 1-1h3"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 9l5-5 5 5"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className={styles.featureContent}>
            <div className={styles.featureTitle}>Free Returns</div>
            <div className={styles.featureDesc}>
              Our commitment to you does not end at delivery. We offer free
              returns to make your experience as easy as possible.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
