import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openModal } from "../../../redux/slices/modalSlice";

import allProducts from "../../../data/products";
import ImageGallery360 from "../../../components/ImageGallery360/ImageGallery360";
import SelectSettingPanel from "../../../components/SelectSettingPanel/SelectSettingPanel";
import ProductCard from "../../../components/ProductCard/ProductCard";
import PillBadge from "../../../components/PillBadge/PillBadge";
import Button from "../../../components/Button/Button";

import styles from "./ProductDetailForSetting.module.css";

/**
 * ProductDetailForSetting
 * - Works inline (with props.onProceed/onBack) or as a standalone route
 * - Clicking on "You May Like" cards swaps product in place (no routing)
 * - Scrolls to the beginning of the product detail content area (not page top)
 */
export default function ProductDetailForSetting(props) {
  const { product: propProduct, onProceed, onBack } = props || {};
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Resolve product: prefer prop -> slug -> first product
  const resolvedFromSlug = useMemo(
    () => allProducts.find((p) => p.slug === slug),
    [slug]
  );
  const initialProduct = propProduct || resolvedFromSlug || allProducts[0];

  // local state holds the currently displayed product (clicking recs updates this)
  const [currentProduct, setCurrentProduct] = useState(initialProduct);

  // Keep currentProduct in sync when propProduct or slug changes
  useEffect(() => {
    const resolved = propProduct || resolvedFromSlug || allProducts[0];
    setCurrentProduct(resolved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propProduct, resolvedFromSlug?.id, slug]);

  // ref to the top of product detail content — we scroll to this on product change
  const detailStartRef = useRef(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (!detailStartRef.current) return;
    // On first render behave instantly (no animation), on subsequent changes scroll smoothly
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

  if (!currentProduct) {
    return (
      <div style={{ padding: 28 }}>
        <p>Product not found</p>
        <Link to="/ready-to-ship">Back to listing</Link>
      </div>
    );
  }

  const product = currentProduct;

  // ---- gallery setup ----
  const variantImages = Object.values(product.variants || {});
  const galleryImages = Array.from({ length: 4 }).map(
    (_, i) => variantImages[i] || variantImages[0] || ""
  );
  const frames =
    product.frames && product.frames.length ? product.frames : null;

  const handleOpenViewDetails = () =>
    dispatch(openModal({ type: "VIEW_DETAILS", data: product }));

  // ---- small helpers ----
  const normalizedRingSizes =
    Array.isArray(product.ringSizes) && product.ringSizes.length
      ? product.ringSizes.filter((r) => r !== undefined && r !== null)
      : [3, 3.5, 4, 4.5, 5];

  const priceToStr = (v, fallback) => {
    if (v == null) return fallback;
    if (typeof v === "number") return `$${v}`;
    if (typeof v === "string" && v.trim() !== "") return v;
    return fallback;
  };

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
  const shippingDateStr = formatShipDate(addBusinessDays(new Date(), 3));

  const settingPanelProps = {
    title: product.title ?? "Solitaire Diamond Engagement Ring",
    subtitle: product.subtitle ?? "Natural",
    ratingValue: product.rating?.value ?? 4.5,
    ratingCount: product.rating?.count ?? 450,
    metals: product.metals ?? [
      { key: "14k_yellow", label: "14K", fullLabel: "14K Yellow Gold" },
      { key: "14k_white", label: "14K", fullLabel: "14K White Gold" },
      { key: "14k_rose", label: "14K", fullLabel: "14K Rose Gold" },
      { key: "18k", label: "18K", fullLabel: "18K Yellow Gold" },
      { key: "pt", label: "Pt", fullLabel: "Platinum (Pt)" },
    ],
    ringSizes: normalizedRingSizes,
    originalPrice: priceToStr(product.originalPrice, "$2400"),
    price: priceToStr(product.price, "$1400"),
    discountPct: product.discountPercentage ?? 25,
    shippingDateStr,
    features: product.features ?? { freeShipping: true, freeReturns: true },
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
  };

  const handleSelectSettingAndContinue = (selection = {}) => {
    if (typeof onProceed === "function") {
      onProceed(selection);
      return;
    }
    navigate("/design", {
      state: {
        product: { ...product, settingSelection: selection },
        startStep: 1,
      },
      replace: true,
    });
  };

  const handleBackToChooseSetting = () => {
    if (typeof onBack === "function") {
      onBack();
      return;
    }
    navigate("/design", { state: { startStep: 0 }, replace: true });
  };

  return (
    <div ref={detailStartRef} id="product-detail-start" className={styles.page}>
      {/* Controls */}
      <div className={styles.rowControls}>
        <div className={styles.leftControl}>
          <button
            onClick={handleBackToChooseSetting}
            className={styles.backLink}
            aria-label="Back to Choose Setting"
          >
            Back To Setting
          </button>
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

      {/* Main Content */}
      <div className={styles.main}>
        {/* Gallery */}
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

          {/* -------------------------
              NEW: "Can be set with" section
              Placed below the 2x2 gallery (left column)
              Uses SVGs from public/images/shapes/<name>.svg
              ------------------------- */}
          <div className={styles.canBeSetWith}>
            <h4>Can be set with :</h4>
            <ul className={styles.shapeList}>
              {[
                "princess",
                "pear",
                "radient",
                "heart",
                "asscher",
                "round",
                "emerald",
                "oval",
                "cushion",
                "marquise",
              ].map((shape) => (
                <li key={shape} className={styles.shapeItem}>
                  <div className={styles.shapeLeft}>
                    <img
                      src={`/images/shapes/${shape}.svg`}
                      alt={shape}
                      className={styles.shapeIcon}
                    />
                    <span className={styles.shapeLabel}>
                      {shape.charAt(0).toUpperCase() + shape.slice(1)}
                    </span>
                  </div>
                  <span className={styles.caratRange}>0.2 - 8.00 Carat</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Panel */}
        <aside className={styles.right}>
          <SelectSettingPanel
            product={{ ...product, ...settingPanelProps }}
            onSelect={(sel) => handleSelectSettingAndContinue(sel)}
            onSelectSetting={(sel) => handleSelectSettingAndContinue(sel)}
            onSelectMetal={(m) => console.log("metal selected", m)}
            onToggleWishlist={(next) =>
              console.log("wishlist toggled", next, product.id)
            }
            onShare={() => console.log("share", product.id)}
          />
        </aside>
      </div>

      {/* Recommendations */}
      <section className={styles.recommend}>
        <PillBadge text="You May Like" highlightChars={6} />
        <div className={styles.recoGrid}>
          {allProducts
            .filter((p) => p.id !== product.id)
            .slice(0, 4)
            .map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onCardClick={(newProd) => {
                  // swap the product inline
                  setCurrentProduct(newProd);
                  // scroll to detail start (we already have an effect that does this;
                  // the small timeout gives the DOM a moment to update)
                  setTimeout(() => {
                    if (detailStartRef.current) {
                      detailStartRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }, 50);
                }}
              />
            ))}
        </div>
      </section>
    </div>
  );
}
