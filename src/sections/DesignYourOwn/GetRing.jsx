// src/pages/ProductDetail/ProductDetail.jsx  (GetRing page)
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/modalSlice";

import allProducts from "../../data/products";
import HeroBanner from "../../components/HeroBanner/HeroBanner";
import ImageGallery360 from "../../components/ImageGallery360/ImageGallery360";
import ProductCard from "../../components/ProductCard/ProductCard";
import PillBadge from "../../components/PillBadge/PillBadge";
import Button from "../../components/Button/Button";

import styles from "./GetRing.module.css";
import GetRingData from "../../components/GetRingData/GetRingData";

export default function GetRing(props) {
  const { product: propProduct, onBack } = props || {};
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Resolve initial product (priority: propProduct -> slug -> fallback)
  const resolvedFromSlug = useMemo(
    () => allProducts.find((p) => p.slug === slug),
    [slug]
  );
  const initialProduct = propProduct || resolvedFromSlug || allProducts[0];

  // Local state holds currently-displayed product so recommendations can swap it in-place.
  const [currentProduct, setCurrentProduct] = useState(initialProduct);

  // Keep in sync if parent prop or slug changes
  useEffect(() => {
    const resolved = propProduct || resolvedFromSlug || allProducts[0];
    setCurrentProduct(resolved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propProduct, resolvedFromSlug?.id, slug]);

  // ref to the beginning of the detail area — scroll to this instead of top:0
  const detailStartRef = useRef(null);
  const firstRender = useRef(true);

  // When product changes, scroll into view (instant on initial load, smooth afterwards)
  useEffect(() => {
    if (!detailStartRef.current) return;
    const behavior = firstRender.current ? "auto" : "smooth";
    try {
      detailStartRef.current.scrollIntoView({ behavior, block: "start" });
    } catch (err) {
      // fallback
      window.scrollTo({
        top: detailStartRef.current?.offsetTop || 0,
        behavior,
      });
    }
    firstRender.current = false;
  }, [currentProduct?.id]);

  const product = currentProduct;

  useEffect(() => {
    // legacy: if any code relied on original immediate top scroll, it's replaced by scrollIntoView above.
    // no-op here; kept to show intent
  }, [product?.id]);

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

  // fill 4 gallery cells
  const variantImages = Object.values(product.variants || {});
  const galleryImages = Array.from({ length: 4 }).map(
    (_, i) => variantImages[i] || variantImages[0] || ""
  );
  const frames =
    product.frames && product.frames.length ? product.frames : null;

  const handleOpenViewDetails = () =>
    dispatch(openModal({ type: "VIEW_DETAILS", data: product }));

  // Back button: call onBack prop or emit product:back event
  const handleBack = (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (typeof onBack === "function") {
      try {
        onBack();
        return;
      } catch (err) {
        // fallthrough to event
        // eslint-disable-next-line no-console
        console.error("onBack threw:", err);
      }
    }
    try {
      window.dispatchEvent(
        new CustomEvent("product:back", { detail: { product } })
      );
    } catch (err) {}
  };

  // When user clicks a "You May Like" card we swap the product in-place (no URL change)
  const handleRecoCardClick = (p) => {
    if (!p || !p.id) return;
    setCurrentProduct(p);

    // small fallback scroll (the effect above will also run). timeout ensures DOM updated.
    setTimeout(() => {
      if (detailStartRef.current) {
        try {
          detailStartRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        } catch (err) {
          window.scrollTo({
            top: detailStartRef.current?.offsetTop || 0,
            behavior: "smooth",
          });
        }
      }
    }, 40);
  };

  // Add to cart / Buy now -> navigate to /cart
  const handleAddToCart = (prod, selections) => {
    console.log("Add to cart ->", prod?.id ?? prod?.title, selections);
    navigate("/cart");
  };
  const handleBuyNow = (prod, selections) => {
    console.log("Buy now ->", prod?.id ?? prod?.title, selections);
    navigate("/cart");
  };

  return (
    <div ref={detailStartRef} className={styles.page}>
      {/* HERO */}
      {/* <HeroBanner ... /> */}

      {/* Back + View details row */}
      <div className={styles.rowControls}>
        <div className={styles.leftControl}>
          <p className={styles.backLink} aria-label="Back to listing">
            Get Ring
          </p>
        </div>

        <div className={styles.centerControl} />

        <div className={styles.rightControl}>
          <a
            className={styles.viewDetailsLink}
            role="link"
            onClick={(e) => {
              e.preventDefault();
              handleOpenViewDetails();
            }}
            href="#"
            aria-label="View details"
          >
            {/* <span className={styles.infoIcon}>i</span> */}
            <span>View Details</span>
          </a>
        </div>
      </div>

      {/* Main */}
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
          <GetRingData
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
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onToggleWishlist={(next, prod) =>
              console.log("onToggleWishlist ->", prod?.id ?? prod?.title, next)
            }
            onShare={(prod) =>
              console.log("onShare ->", prod?.id ?? prod?.title)
            }
          />
        </aside>
      </div>

      {/* Recommendations — "You May Like" */}
      <section className={styles.recommend}>
        <PillBadge text="You May Like" highlightChars={6} />
        <div className={styles.recoGrid}>
          {allProducts
            .filter((p) => p.id !== product.id)
            .slice(0, 4)
            .map((p) => (
              // pass onCardClick so ProductCard will call this handler to swap inline
              <ProductCard
                key={p.id}
                product={p}
                onCardClick={handleRecoCardClick}
              />
            ))}
        </div>
      </section>
    </div>
  );
}
