import React, { useEffect, useMemo, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openModal } from "../../../redux/slices/modalSlice";

import allProducts from "../../../data/products";
import HeroBanner from "../../../components/HeroBanner/HeroBanner";
import ImageGallery360 from "../../../components/ImageGallery360/ImageGallery360";
import ProductCard from "../../../components/ProductCard/ProductCard";
import PillBadge from "../../../components/PillBadge/PillBadge";
import Button from "../../../components/Button/Button";

import styles from "./ProductDetail.module.css";
import ProductInfoPanel from "../../../components/ProductInfoPanel/ProductInfoPanel";
/**
 * ProductDetail
 * - Accepts optional `product` prop (when rendered inline) and optional `onBack` callback.
 * - If `product` prop not provided, resolves product by route :slug (existing behavior).
 *
 * Behavior change:
 * - Clicking a ProductCard inside "You May Like" will replace the current product
 *   content in-place (no routing). This uses local state `currentProduct`.
 * - When product changes (initial load or swap), page scrolls so product detail sits
 *   below header/steps + an extra gap (150px). This makes the detail appear more "top".
 */
export default function ProductDetail(props) {
  const { product: propProduct, onBack } = props || {};
  const { slug } = useParams();
  const dispatch = useDispatch();

  // Resolve initial product (priority: propProduct -> slug -> fallback)
  const resolvedFromSlug = useMemo(
    () => allProducts.find((p) => p.slug === slug),
    [slug]
  );

  const initialProduct = propProduct || resolvedFromSlug || allProducts[0];

  // local product state - clicking recommendations will set this
  const [currentProduct, setCurrentProduct] = useState(initialProduct);

  // Keep in sync if parent provides a different product or slug changes
  useEffect(() => {
    const resolved = propProduct || resolvedFromSlug || allProducts[0];
    setCurrentProduct(resolved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propProduct, resolvedFromSlug?.id, slug]);

  // ref to top of this detail section
  const detailRef = useRef(null);
  const firstRender = useRef(true);

  /**
   * Scroll helper: ensures the element top appears below steps/header + extraGap.
   * extraGap default is 150px (change if you want different spacing).
   *
   * It attempts to find a "steps" element (common selectors) and use its height.
   * If not found, falls back to header height.
   */
  const scrollElementBelowSteps = (el, extraGap = 150, smooth = true) => {
    if (!el || typeof window === "undefined") return;

    const stepSelectors = [
      ".design-steps",
      ".design-progress",
      ".progress",
      ".progress-bar",
      ".design-flow",
      ".designStep",
      ".steps",
      ".stepper",
      ".choose-steps",
    ];
    let stepsEl = null;
    for (const sel of stepSelectors) {
      const s = document.querySelector(sel);
      if (s) {
        stepsEl = s;
        break;
      }
    }

    const stepHeight = stepsEl ? stepsEl.getBoundingClientRect().height : 0;
    const headerEl = document.querySelector("header");
    const headerHeight = headerEl ? headerEl.offsetHeight : 0;

    const desiredOffset = (stepHeight || headerHeight) + extraGap;

    const rect = el.getBoundingClientRect();
    const elementTopDoc = window.scrollY + rect.top;

    const targetTop = Math.max(0, Math.round(elementTopDoc - desiredOffset));

    try {
      window.scrollTo({ top: targetTop, behavior: smooth ? "smooth" : "auto" });
    } catch (err) {
      window.scrollTo(0, targetTop);
    }
  };

  // When the product changes, scroll so detail sits below steps/header + 150px gap
  useEffect(() => {
    if (!detailRef.current) return;
    const smooth = !firstRender.current;
    scrollElementBelowSteps(detailRef.current, 150, smooth);
    firstRender.current = false;
  }, [currentProduct?.id]);

  const product = currentProduct;

  if (!product) {
    return (
      <div style={{ padding: 28 }}>
        <p>Product not found</p>
        <div>
          <button
            type="button"
            onClick={() => {
              if (typeof onBack === "function") return onBack();
              try {
                window.dispatchEvent(new CustomEvent("product:back"));
              } catch (err) {}
            }}
          >
            ← Back to listing
          </button>
        </div>
      </div>
    );
  }

  // images to fill 4 cells (use first image as fallback)
  const variantImages = Object.values(product.variants || {});
  const galleryImages = Array.from({ length: 4 }).map(
    (_, i) => variantImages[i] || variantImages[0] || ""
  );

  // frames property optional (for ImageGallery360)
  const frames =
    product.frames && product.frames.length ? product.frames : null;

  const handleOpenViewDetails = () =>
    dispatch(openModal({ type: "VIEW_DETAILS", data: product }));

  /**
   * Back handler:
   * 1) If parent passed onBack (inline use), call it.
   * 2) Otherwise dispatch a DOM event "product:back" (no URL change).
   */
  const handleBack = (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();

    if (typeof onBack === "function") {
      try {
        onBack();
        return;
      } catch (err) {
        // if onBack throws, still emit event as a fallback
        // eslint-disable-next-line no-console
        console.error("onBack threw:", err);
      }
    }

    // emit an event so parent can react (inline) — no navigation performed here
    try {
      if (
        typeof window !== "undefined" &&
        typeof window.CustomEvent === "function"
      ) {
        window.dispatchEvent(
          new CustomEvent("product:back", { detail: { product } })
        );
      }
    } catch (err) {
      // ignore
    }
  };

  // When user clicks a "You May Like" card we swap the product in-place (no URL change)
  const handleRecoCardClick = (p) => {
    if (!p || !p.id) return;
    setCurrentProduct(p);

    // small timeout to allow DOM update, then scroll the detail into position
    setTimeout(() => {
      if (detailRef.current) {
        scrollElementBelowSteps(detailRef.current, 150, true);
      }
    }, 40);
  };

  return (
    <div className={styles.page} ref={detailRef}>
      {/* Back + View details row */}
      <div className={styles.rowControls}>
        <button onClick={handleBack} className={styles.backLink}>
          Back To Gallery
        </button>

        <div className={styles.centerControl}>
          <button
            className={styles.viewDetailsLink}
            onClick={handleOpenViewDetails}
          >
            View Details
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className={styles.main}>
        <div className={styles.left}>
          <div className={styles.grid2x2}>
            {galleryImages.map((src, idx) => {
              const isFirst = idx === 0;
              return (
                <div key={idx} className={styles.cell}>
                  {isFirst && frames ? (
                    <ImageGallery360 frames={frames} alt={product.title} />
                  ) : isFirst ? (
                    <div className={styles.cellInner}>
                      <img
                        src={src}
                        alt={`${product.title} view ${idx + 1}`}
                        className={styles.cellImg}
                        loading="lazy"
                      />
                      <button
                        type="button"
                        className={styles.overlayBtn}
                        onClick={handleOpenViewDetails}
                        aria-label="Open 360 viewer"
                      >
                        <span className={styles.overlayIcon}>⤾</span>
                        <span className={styles.overlayText}>
                          Tap to see in 360°
                        </span>
                      </button>
                    </div>
                  ) : (
                    <img
                      src={src}
                      alt={`${product.title} view ${idx + 1}`}
                      className={styles.cellImg}
                      loading="lazy"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <aside className={styles.right}>
          <ProductInfoPanel
            product={{
              ...product,
              metals: [
                {
                  key: "14k_yellow",
                  label: "14K",
                  fullLabel: "14K Yellow Gold",
                },
                { key: "14k_white", label: "14K", fullLabel: "14K White Gold" },
                { key: "14k_rose", label: "14K", fullLabel: "14K Rose Gold" },
                { key: "18k_gold", label: "18K", fullLabel: "18K Yellow Gold" },
                { key: "pt", label: "Pt", fullLabel: "Platinum (Pt)" },
              ],
              carats: [1, 1.5, 2, 2.5],
              shapes: [
                { key: "round", label: "Round" },
                { key: "oval", label: "Oval" },
                { key: "marquise", label: "Marquise" },
              ],
              diamondTabs: ["Natural", "Lab grown"],
              price: product.price ?? 1400,
              originalPrice: product.originalPrice ?? 2400,
              ringSizes: [13, , 14, , 15, , 16, , 17, 18, 19, 20, 21, 22],
              features: product.features ?? {
                freeShipping: true,
                freeReturns: true,
              },
              detailsSections: product.detailsSections ?? [
                {
                  title: "Product details",
                  body: "This 1.00 round H diamond is sold exclusively on Arra jewels.",
                },
                {
                  title: "Secure Shopping",
                  body: "We use secure payment methods and encrypted connections to protect your purchase.",
                },
                {
                  title: "Life Time Product Warranty",
                  body: "We provide lifetime warranty on workmanship and manufacturing defects.",
                },
                {
                  title: "About Gemstone And Diamonds",
                  body: "All our gemstones and diamonds are ethically sourced and certified by leading gemological labs.",
                },
              ],
            }}
            onAddToCart={(prod, selections) =>
              console.log("onAddToCart ->", prod?.id ?? prod?.title, selections)
            }
            onBuyNow={(prod, selections) =>
              console.log("onBuyNow ->", prod?.id ?? prod?.title, selections)
            }
            onToggleWishlist={(next, prod) =>
              console.log("onToggleWishlist ->", prod?.id ?? prod?.title, next)
            }
            onShare={(prod) =>
              console.log("onShare ->", prod?.id ?? prod?.title)
            }
          />
        </aside>
      </div>

      {/* Recommendations */}
      <section className={styles.recommend}>
        <PillBadge text="You May Like" highlightChars={6} />
        <div className={styles.recoGrid}>
          {allProducts
            .filter((p) => p.id !== product.id)
            .slice(0, 8)
            .map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onCardClick={() => handleRecoCardClick(p)}
              />
            ))}
        </div>
      </section>
    </div>
  );
}
