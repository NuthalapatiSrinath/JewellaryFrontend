// src/sections/CollectionProductDetail/CollectionProductDetail.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/modalSlice";

import allProducts from "../../data/products";
import ImageGallery360 from "../../components/ImageGallery360/ImageGallery360";
import ProductInfoPanel from "../../components/FeaturedCollectionInfoPanel/FeaturedCollectionInfoPanel";
import ProductCard from "../../components/ProductCard/ProductCard";
import PillBadge from "../../components/PillBadge/PillBadge";
import Button from "../../components/Button/Button";

import styles from "./CollectionProductDetail.module.css";
import FooterPage from "../../pages/FooterPage/FooterPage";

/**
 * CollectionProductDetail
 * - Accepts optional `product` prop (when rendered inline) and optional `onBack` callback.
 * - Uses local state `currentProduct` so "You May Like" cards replace content inline.
 */
export default function CollectionProductDetail(props) {
  const { product: propProduct, onBack } = props || {};
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ref to top of this page content so we can find scroll parents reliably
  const pageRef = useRef(null);

  // helper: find nearest scrollable ancestor (including documentElement/body)
  const findScrollableAncestor = (el) => {
    if (!el) return null;
    let node = el;
    while (node) {
      const overflowY = window.getComputedStyle(node).overflowY;
      const isScrollable =
        (overflowY === "auto" || overflowY === "scroll") &&
        node.scrollHeight > node.clientHeight;
      if (isScrollable) return node;
      node = node.parentElement;
    }
    return null;
  };

  // robust scroll-to-top that attempts several strategies
  const scrollAllTheWayToTop = (behavior = "auto") => {
    try {
      // 1) window
      if (typeof window !== "undefined" && window.scrollTo) {
        window.scrollTo({ top: 0, left: 0, behavior });
      }

      // 2) document elements (some browsers / containers)
      if (typeof document !== "undefined") {
        document.documentElement && (document.documentElement.scrollTop = 0);
        document.body && (document.body.scrollTop = 0);
      }

      // 3) nearest scrollable ancestor of this page wrapper
      const scrollParent = findScrollableAncestor(pageRef.current);
      if (scrollParent) {
        scrollParent.scrollTop = 0;
      }

      // 4) as a last attempt, also set scrollTop on common app containers
      const possibleContainers = ["#root", "#app", ".app", ".site-wrapper"];
      possibleContainers.forEach((sel) => {
        try {
          const el = document.querySelector(sel);
          if (el && el.scrollTop !== undefined) el.scrollTop = 0;
        } catch (err) {}
      });
    } catch (err) {
      // silent fail
      // console.warn("scrollAllTheWayToTop failed", err);
    }
  };

  // Scroll to top when slug changes (covers direct loads & navigation)
  useEffect(() => {
    // immediate jump to top so content starts from 0 — change behavior to "smooth" if desired
    scrollAllTheWayToTop("auto");
  }, [slug]);

  // Resolve initial product (prop -> slug -> fallback)
  const resolvedFromSlug = useMemo(
    () => allProducts.find((p) => p.slug === slug),
    [slug]
  );
  const initialProduct = propProduct || resolvedFromSlug || allProducts[0];

  const [currentProduct, setCurrentProduct] = useState(initialProduct);

  // sync when slug or prop changes
  useEffect(() => {
    const resolved = propProduct || resolvedFromSlug || allProducts[0];
    setCurrentProduct(resolved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propProduct, resolvedFromSlug?.id, slug]);

  // Optional: when current product changes (inline replacement) scroll a bit to keep header visible
  useEffect(() => {
    if (currentProduct?.id) {
      // small offset so header remains visible; use 0 to snap to absolute top
      const offset = 0;
      try {
        if (typeof window !== "undefined" && window.scrollTo) {
          window.scrollTo({ top: offset, behavior: "auto" });
        }
        // also attempt scrollable ancestor
        const scrollParent = findScrollableAncestor(pageRef.current);
        if (scrollParent) scrollParent.scrollTop = offset;
      } catch (err) {}
    }
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

  // Build gallery (4 cells)
  const variantImages = Object.values(product.variants || {});
  const galleryImages = Array.from({ length: 4 }).map(
    (_, i) => variantImages[i] || variantImages[0] || ""
  );

  const frames =
    product.frames && product.frames.length ? product.frames : null;

  const handleOpenViewDetails = () =>
    dispatch(openModal({ type: "VIEW_DETAILS", data: product }));

  const handleBack = (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();

    // if parent provided an onBack handler, call it first (inline usage)
    if (typeof onBack === "function") {
      try {
        onBack();
        return;
      } catch (err) {
        console.error("onBack threw:", err);
      }
    }

    // prefer history back; if history is not available, navigate to home as a safe fallback
    try {
      if (
        typeof window !== "undefined" &&
        window.history &&
        window.history.length > 1
      ) {
        navigate(-1);
      } else {
        // fallback route — change to any safe listing URL you prefer
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("navigate failed:", err);
    }
  };

  return (
    <>
      {/* attach ref to top-level page wrapper so we can find scroll parents */}
      <div ref={pageRef} className={styles.page}>
        {/* Back + View details row */}
        <div className={styles.rowControls}>
          <button onClick={handleBack} className={styles.backLink}>
            Back To Featured Collection
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
                  {
                    key: "14k_white",
                    label: "14K",
                    fullLabel: "14K White Gold",
                  },
                  { key: "14k_rose", label: "14K", fullLabel: "14K Rose Gold" },
                  {
                    key: "18k_gold",
                    label: "18K",
                    fullLabel: "18K Yellow Gold",
                  },
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
                console.log(
                  "onAddToCart ->",
                  prod?.id ?? prod?.title,
                  selections
                )
              }
              onBuyNow={(prod, selections) =>
                console.log("onBuyNow ->", prod?.id ?? prod?.title, selections)
              }
              onToggleWishlist={(next, prod) =>
                console.log(
                  "onToggleWishlist ->",
                  prod?.id ?? prod?.title,
                  next
                )
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
                  onCardClick={(pickedProduct) => {
                    // replace current product in-place
                    setCurrentProduct(pickedProduct);
                    // optional: smooth scroll a little so user sees the change
                    setTimeout(() => {
                      scrollAllTheWayToTop("smooth");
                    }, 50);
                  }}
                />
              ))}
          </div>
        </section>
      </div>
      <FooterPage />
    </>
  );
}
