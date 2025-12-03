// src/components/ProductCard/ProductCardAllWhere.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProductsCardAllWhere.module.css";

/**
 * ProductCardAllWhere
 *
 * Props:
 * - product: { id, title, subtitle, price, variants, defaultColor, slug }
 * - onCardClick: function(product)  // optional — parent handles navigation/opening
 *
 * Behavior:
 * - If onCardClick is provided, call it.
 * - Otherwise navigate to /collection/:slug (SPA) using react-router.
 * - If navigation isn't available, falls back to emitting a "product:open" CustomEvent.
 */
export default function ProductCardAllWhere({ product, onCardClick }) {
  const [color, setColor] = useState(product.defaultColor || "gold");
  const [wishlisted, setWishlisted] = useState(false);
  const navigate = useNavigate();

  const handleWishlist = (e) => {
    e?.stopPropagation?.();
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

  const metalLabel = color === "white" ? "Diamond" : "Gold";
  const currentImage = product?.variants?.[color];

  // When card body is clicked prefer parent handler
  const handleCardActivate = (e) => {
    if (e) e.stopPropagation?.();

    // 1) If parent provided handler, call it
    if (typeof onCardClick === "function") {
      onCardClick(product);
      return;
    }

    // 2) Otherwise try SPA navigation to collection detail using slug
    // inside handleCardActivate in ProductCardAllWhere
    try {
      if (product && product.slug) {
        navigate(`/wedding/collection-product/${product.slug}`);
        return;
      }
    } catch (err) {
      console.warn("navigate failed:", err);
    }

    // 3) Fallback: emit event so older inline usage still works
    try {
      if (
        typeof window !== "undefined" &&
        typeof window.CustomEvent === "function"
      ) {
        window.dispatchEvent(
          new CustomEvent("product:open", { detail: product })
        );
        return;
      }
    } catch (err) {
      // swallow
    }

    // 4) Last resort: no-op with a console warning
    console.warn(
      "ProductCard clicked but no handler; event dispatched or no-op."
    );
  };

  return (
    <article className={styles.card} aria-label={product.title}>
      <div className={styles.imageWrap} aria-hidden>
        {currentImage && (
          <img
            src={currentImage}
            alt={`${product.title} in ${metalLabel}`}
            className={styles.image}
            loading="lazy"
          />
        )}

        <button
          type="button"
          className={`${styles.heart} ${wishlisted ? styles.heartActive : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            handleWishlist(e);
          }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={styles.heartIcon}
            aria-hidden
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>

      <div
        className={styles.body}
        role="button"
        tabIndex={0}
        onClick={handleCardActivate}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardActivate(e);
          }
        }}
      >
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

        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.subtitle}>{product.subtitle}</p>
        <div className={styles.price}>{product.price}</div>
      </div>
    </article>
  );
}
