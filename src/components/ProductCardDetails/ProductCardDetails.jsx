import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/modalSlice";
import styles from "./ProductCardDetails.module.css";

/**
 * ProductCardDetails
 * - Versatile product card component.
 * - If `onCardClick` is provided → calls it, no navigation.
 * - If `disableNavigation` is true → blocks URL navigation entirely.
 * - Otherwise → navigates to /product/:slug.
 */
export default function ProductCardDetails({
  product,
  onCardClick,
  disableNavigation = false,
}) {
  const [color, setColor] = useState(product.defaultColor || "gold");
  const [wishlisted, setWishlisted] = useState(false);
  const dispatch = useDispatch();

  const handleWishlist = (e) => {
    e.stopPropagation?.();
    setWishlisted((prev) => {
      const next = !prev;
      console.log(
        next
          ? `${product.title} — Added to wishlist`
          : `${product.title} — Removed from wishlist`
      );
      return next;
    });
  };

  const handleViewDetails = (e) => {
    e.stopPropagation?.();
    dispatch(openModal({ type: "VIEW_DETAILS", data: product }));
  };

  const metalLabel =
    color === "white" ? "Diamond" : color === "rose" ? "Rose" : "Gold";
  const currentImage = product?.variants?.[color];

  /**
   * Card activation logic
   * - 1️⃣ If onCardClick provided → call it only.
   * - 2️⃣ If disableNavigation → do nothing.
   * - 3️⃣ Otherwise → navigate by slug.
   */
  const handleCardActivate = (e) => {
    e?.stopPropagation?.();

    // case 1: parent controls click (no navigation)
    if (typeof onCardClick === "function") {
      onCardClick(product);
      return;
    }

    // case 2: explicitly block navigation
    if (disableNavigation) {
      console.warn(
        "Navigation disabled for ProductCardDetails:",
        product?.title
      );
      return;
    }

    // case 3: fallback — navigate to /product/:slug
    const slug = product.slug || product.id;
    if (slug) {
      window.location.href = `/product/${slug}`;
    }
  };

  return (
    <article className={styles.card} aria-label={product.title}>
      {/* IMAGE WRAP */}
      <div
        className={styles.imageWrap}
        aria-hidden
        onClick={handleCardActivate}
        role="button"
        tabIndex={0}
      >
        {currentImage && (
          <img
            src={currentImage}
            alt={`${product.title} in ${metalLabel}`}
            className={styles.image}
            loading="lazy"
          />
        )}

        {/* HEART / WISHLIST ICON */}
        <button
          type="button"
          className={`${styles.heart} ${wishlisted ? styles.heartActive : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            handleWishlist(e);
          }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg viewBox="0 0 24 24" className={styles.heartIcon} aria-hidden>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>

      {/* BODY */}
      <div
        className={styles.body}
        role="button"
        tabIndex={0}
        onClick={handleCardActivate}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleCardActivate(e);
        }}
      >
        {/* SWATCHES */}
        <div
          className={styles.swatchRow}
          role="group"
          aria-label="Choose metal"
          onClick={(e) => e.stopPropagation()}
        >
          {["gold", "white", "rose"].map((c) => {
            const dot =
              c === "gold" ? "#b4c133" : c === "white" ? "#e7e7e7" : "#edd9d9";
            const isActive = color === c;
            return (
              <button
                key={c}
                type="button"
                className={`${styles.swatch} ${
                  isActive ? styles.swatchActive : ""
                }`}
                style={{ backgroundColor: dot }}
                onClick={(e) => {
                  e.stopPropagation();
                  setColor(c);
                }}
                aria-label={`Choose ${c}`}
              />
            );
          })}
          <span className={styles.metalText}>{metalLabel}</span>
        </div>

        {/* TITLE + SUBTITLE */}
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.subtitle}>{product.subtitle}</p>
        <div className={styles.price}>{product.price}</div>

        {/* VIEW DETAILS BUTTON */}
        <button
          type="button"
          className={styles.viewDetails}
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails(e);
          }}
        >
          View Details
        </button>
      </div>
    </article>
  );
}
