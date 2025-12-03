// DiamondSummary.jsx
import React, { useState, useEffect } from "react";
import styles from "./GetRingData.module.css";
import Button from "../Button/Button"; // adjust path if needed

export default function GetRingData({ product = {} }) {
  const {
    title = "Solitaire Diamond Engagement Ring",
    subtitle = "Natural",
    specs = ["1.00 ct", "H color", "VVS2 c", "Good clarity"],
    detailsSections = [
      {
        title: "Product details",
        body: "This 1.00 round H diamond is sold exclusively on Arra jewels.",
      },
      { title: "Your order Includes" },
      { title: "GIA Grading report" },
      { title: "Life time Diamond upgrade program" },
    ],
    price = 6000, // number or formatted string
    url,
  } = product;

  // Accordion closed by default
  const [openIndex, setOpenIndex] = useState(null);

  // Wishlist (heart) state
  const [isWishlisted, setIsWishlisted] = useState(false);

  // share feedback (transient)
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const toggleAccordion = (i) =>
    setOpenIndex((prev) => (prev === i ? null : i));
  const toggleWishlist = (e) => {
    e?.stopPropagation?.();
    setIsWishlisted((s) => !s);
  };

  const handleShare = async (e) => {
    e?.stopPropagation?.();
    const shareUrl =
      url ?? (typeof window !== "undefined" ? window.location.href : "");
    try {
      if (navigator.share) {
        await navigator.share({ title, text: subtitle, url: shareUrl });
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
      } else {
        const input = document.createElement("textarea");
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
        setCopied(true);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Share/copy failed", err);
    }
  };

  // shipping date (3 calendar days)
  const addDays = (d, days) => {
    const res = new Date(d);
    res.setDate(res.getDate() + days);
    return res;
  };
  const shippingDateStr = addDays(new Date(), 3).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  const formatMoney = (v) => {
    if (v == null) return "";
    if (typeof v === "string" && v.trim() !== "") return v;
    const n = Number(v);
    if (Number.isNaN(n)) return String(v);
    return n.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
  };

  const goToCart = () => {
    // navigate to /cart — adjust if you use react-router (useNavigate) in your app
    if (typeof window !== "undefined") window.location.href = "/cart";
  };

  return (
    <div className={styles.panel}>
      {/* Header Row */}
      <div className={styles.headerRow}>
        <h1 className={styles.title}>{title}</h1>

        <div className={styles.icons}>
          <button
            className={`${styles.heart} ${
              isWishlisted ? styles.heartActive : ""
            }`}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={toggleWishlist}
            aria-pressed={isWishlisted}
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
          >
            <svg viewBox="0 0 24 24" className={styles.heartIcon} aria-hidden>
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 
                2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 
                4.5 2.09C13.09 3.81 14.76 3 16.5 
                3 19.58 3 22 5.42 22 8.5c0 
                3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
          </button>

          <button
            className={styles.shareBtn}
            title="Share product"
            onClick={handleShare}
            aria-label="Share product"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
              <circle cx="18" cy="5" r="3" fill="#000" />
              <circle cx="6" cy="12" r="3" fill="#000" />
              <circle cx="18" cy="19" r="3" fill="#000" />
              <path
                d="M8.59 13.51L15.42 17.49"
                stroke="#000"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M15.41 6.51L8.59 10.49"
                stroke="#000"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {copied && <span className={styles.copyToast}>Link copied</span>}
        </div>
      </div>

      {/* Subtitle */}
      <div className={styles.subtitleSmall}>{subtitle}</div>

      {/* Specs */}
      <div className={styles.specsRow}>
        {specs.map((spec, i) => (
          <span key={i} className={styles.specTag}>
            {spec}
          </span>
        ))}
      </div>

      {/* PRICE row: price and "Starting Price" in one line */}
      <div className={styles.priceRow}>
        <div className={styles.priceBlock}>
          <div className={styles.priceAmount}>{formatMoney(price)}</div>
          <div className={styles.priceNote}>Starting Price</div>
        </div>
      </div>

      {/* Full-width CTA row (two buttons occupying the width) */}
      <div className={styles.ctaFullRow}>
        <div className={styles.ctaInner}>
          <Button
            label="Add to cart"
            bgColor="#fff"
            textColor="#A54EA8"
            borderColor="rgba(165,78,168,0.14)"
            width="100%"
            height="52px"
            borderRadius="10px"
            fontSize="18px"
            fontWeight="600"
            padding="0 22px"
            onClick={goToCart}
          />

          <Button
            label="Buy Now"
            bgColor="#A54EA8"
            textColor="#fff"
            borderColor="transparent"
            width="100%"
            height="52px"
            borderRadius="10px"
            fontSize="18px"
            fontWeight="600"
            padding="0 22px"
            onClick={goToCart}
          />
        </div>
      </div>

      {/* Ships by row */}
      <div className={styles.shipRow}>
        <svg
          className={styles.shipIcon}
          viewBox="0 0 24 24"
          width="20"
          height="20"
          aria-hidden
        >
          <path d="M3 7h13v8H3z" fill="#A54EA8" opacity="0.12" />
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
        <div className={styles.shipText}>Ships by {shippingDateStr}</div>
      </div>

      {/* Accordion */}
      <div className={styles.accordion}>
        {detailsSections.map((sec, i) => (
          <div key={i} className={styles.accItem}>
            <button
              className={styles.accHeader}
              onClick={() => toggleAccordion(i)}
              aria-expanded={openIndex === i}
              aria-controls={`acc-body-${i}`}
              id={`acc-header-${i}`}
            >
              <span>{sec.title}</span>
              <span className={styles.accToggle}>
                <span className={styles.accIcon}>
                  {openIndex === i ? "−" : "+"}
                </span>
              </span>
            </button>

            <div
              id={`acc-body-${i}`}
              className={`${styles.accBodyWrap} ${
                openIndex === i ? styles.accBodyWrapOpen : ""
              }`}
              role="region"
              aria-labelledby={`acc-header-${i}`}
            >
              {sec.body && (
                <div className={styles.accBody}>
                  <div style={{ whiteSpace: "pre-wrap" }}>{sec.body}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
