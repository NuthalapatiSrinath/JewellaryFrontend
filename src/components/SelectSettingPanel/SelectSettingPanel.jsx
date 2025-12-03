// SelectSettingPanel.jsx
import React, { useEffect, useRef, useState } from "react";
import Button from "../Button/Button";
import styles from "./SelectSettingPanel.module.css";

/* (file header and defaults unchanged) */

export default function SelectSettingPanel({
  product = null,
  title,
  subtitle,
  ratingValue,
  ratingCount,
  metals,
  ringSizes,
  originalPrice,
  price,
  discountPct,
  shippingDateStr,
  features,
  detailsSections,
  onSelectSetting,
  onSelect,
  onSelectMetal,
  onToggleWishlist,
  onShare,
}) {
  const defaults = {
    /* ...same defaults as before (metals, shapes, centreStones, etc.) */
    title: "Solitaire Diamond Engagement Ring",
    subtitle: "Natural",
    ratingValue: 4.5,
    ratingCount: 450,
    metals: [
      { key: "14k_yellow", label: "14K", fullLabel: "14K Yellow Gold" },
      { key: "14k_white", label: "14K", fullLabel: "14K White Gold" },
      { key: "14k_rose", label: "14K", fullLabel: "14K Rose Gold" },
      { key: "18k", label: "18K", fullLabel: "18K Yellow Gold" },
      { key: "pt", label: "Pt", fullLabel: "Platinum (Pt)" },
    ],
    shapes: [
      { key: "asscher", label: "Asscher" },
      { key: "pear", label: "Pear" },
      { key: "princess", label: "Princess" },
      { key: "heart", label: "Heart" },
      { key: "emerald", label: "Emerald" },
      { key: "round", label: "Round" },
      // { key: "radiant", label: "Radiant" },
      { key: "oval", label: "Oval" },
      { key: "marquise", label: "Marquise" },
      { key: "cushion", label: "Cushion" },
    ],
    centreStones: ["1 Ct", "1.5 Ct", "2 Ct", "2.5 Ct", "3 Ct", "3.5 Ct"],
    ringSizes: [3, 3.5, 4, 4.5, 5],
    originalPrice: "$2400",
    price: "$1400",
    discountPct: 25,
    shippingDateStr: new Date().toLocaleDateString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "short",
    }),
    features: { freeShipping: true, freeReturns: true },
    detailsSections: [
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

  const p = {
    ...defaults,
    ...(product || {}),
    ...(title !== undefined ? { title } : {}),
    ...(subtitle !== undefined ? { subtitle } : {}),
    ...(ratingValue !== undefined ? { ratingValue } : {}),
    ...(ratingCount !== undefined ? { ratingCount } : {}),
    ...(metals !== undefined ? { metals } : {}),
    ...(ringSizes !== undefined ? { ringSizes } : {}),
    ...(originalPrice !== undefined ? { originalPrice } : {}),
    ...(price !== undefined ? { price } : {}),
    ...(discountPct !== undefined ? { discountPct } : {}),
    ...(shippingDateStr !== undefined ? { shippingDateStr } : {}),
    ...(features !== undefined ? { features } : {}),
    ...(detailsSections !== undefined ? { detailsSections } : {}),
  };

  p.shapes = (product && product.shapes) || p.shapes;
  p.centreStones = (product && product.centreStones) || p.centreStones;

  const [selectedMetal, setSelectedMetal] = useState(
    p.metals?.[0]?.key ?? null
  );
  const [selectedShape, setSelectedShape] = useState(
    p.shapes?.find((s) => s.key === "round")?.key ??
      p.shapes?.[0]?.key ??
      "round"
  );
  const [selectedCentreStone, setSelectedCentreStone] = useState(
    p.centreStones?.[0] ?? ""
  );
  const [selectedRingSize, setSelectedRingSize] = useState(
    p.ringSizes?.[0] ?? ""
  );
  const [accOpen, setAccOpen] = useState(null);
  const [ringOpen, setRingOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const ringRef = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (!ringRef.current) return;
      if (!ringRef.current.contains(e.target)) setRingOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  useEffect(() => {
    if (!p.metals || p.metals.length === 0) return;
    if (!p.metals.some((m) => m.key === selectedMetal)) {
      setSelectedMetal(p.metals[0].key);
    }
  }, [p.metals]);

  const toggleAcc = (i) => setAccOpen((v) => (v === i ? null : i));
  const toggleWishlist = () => {
    const next = !isWishlisted;
    setIsWishlisted(next);
    onToggleWishlist?.(next);
  };

  const dispatchSelection = (opts = {}) => {
    const selection = {
      metal: p.metals.find((m) => m.key === selectedMetal) ?? null,
      ringSize: selectedRingSize,
      shape: p.shapes.find((s) => s.key === selectedShape) ?? null,
      centreStone: selectedCentreStone ?? null,
    };
    try {
      if (typeof onSelectSetting === "function") onSelectSetting(selection);
    } catch (err) {}
    try {
      if (typeof onSelect === "function") onSelect(selection);
    } catch (err) {}
    try {
      if (
        typeof window !== "undefined" &&
        typeof window.CustomEvent === "function"
      ) {
        const detail = { product: p, selection, ...opts };
        window.dispatchEvent(
          new CustomEvent("choosetting:selected", { detail })
        );
      }
    } catch (err) {}
  };

  const handleAddToBag = () => {
    // dispatchSelection();
    try {
      window.location.href = "/cart";
    } catch (e) {}
  };

  // NEW helper: scroll the product detail so it appears BELOW the design/steps area
  // extraGap is added below the steps (150px requested)
  const scrollToProductBelowSteps = (
    productEl,
    extraGap = 150,
    behavior = "smooth"
  ) => {
    if (!productEl) return;

    // try to find the "design steps" element (common candidate selectors)
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
      const el = document.querySelector(sel);
      if (el) {
        stepsEl = el;
        break;
      }
    }

    // measure heights to compute offset
    const stepHeight = stepsEl ? stepsEl.getBoundingClientRect().height : 0;

    // fall back to header height if steps element not found
    const headerEl = document.querySelector("header");
    const headerHeight = headerEl ? headerEl.offsetHeight : 0;

    // desiredOffset is how far from viewport top we want productTop to appear.
    // If we found stepsEl use its height, otherwise use headerHeight.
    const desiredOffset = (stepHeight || headerHeight) + extraGap;

    // product top relative to document
    const productRect = productEl.getBoundingClientRect();
    const productTopDoc = window.scrollY + productRect.top;

    // compute scroll target such that the product top sits 'desiredOffset' from viewport top
    const targetScrollTop = Math.max(
      0,
      Math.round(productTopDoc - desiredOffset)
    );

    window.scrollTo({ top: targetScrollTop, behavior });
  };

  const handleFullInventory = () => {
    // keep existing behavior: dispatch event saying fullInventory was requested
    dispatchSelection({ fullInventory: true });

    // then scroll so the product detail appears below the design/steps with 150px extra gap
    setTimeout(() => {
      // prefer actual product-detail-start element; fallback to choose-setting-detail
      const productEl =
        document.getElementById("product-detail-start") ||
        document.getElementById("choose-setting-detail");

      if (productEl) {
        scrollToProductBelowSteps(productEl, 0, "smooth");
      } else {
        // if no product element found, just leave the page top experience unchanged:
        window.scrollTo({ top: 490, behavior: "smooth" });
      }
    }, 80);
  };

  const handleMetalClick = (m) => {
    setSelectedMetal(m.key);
    onSelectMetal?.(m);
  };

  const handleShare = () => {
    onShare?.();
  };

  const renderStars = () => {
    const arr = [];
    for (let i = 1; i <= 5; i++) {
      const frac = Math.max(0, Math.min(1, p.ratingValue - (i - 1)));
      const pct = Math.round(frac * 100);
      arr.push(
        <span key={i} className={styles.starWrap}>
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path
              d="M12 .587l3.668 7.571L24 9.423l-6 5.854L19.335 24 12 19.771 4.665 24 6 15.277 0 9.423l8.332-1.265z"
              fill="#DADADA"
            />
          </svg>
          {pct > 0 && (
            <span className={styles.starFill} style={{ width: `${pct}%` }}>
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path
                  d="M12 .587l3.668 7.571L24 9.423l-6 5.854L19.335 24 12 19.771 4.665 24 6 15.277 0 9.423l8.332-1.265z"
                  fill="#606060"
                />
              </svg>
            </span>
          )}
        </span>
      );
    }
    return arr;
  };

  const selectedMetalObj = p.metals.find((m) => m.key === selectedMetal);
  const selectedMetalLabel =
    selectedMetalObj?.fullLabel ?? selectedMetalObj?.label ?? "";
  const selectedShapeObj = p.shapes.find((s) => s.key === selectedShape);
  const selectedShapeLabel = selectedShapeObj?.label ?? "";

  return (
    <aside className={styles.panel} aria-label="Select setting panel">
      <div className={styles.headerRow}>
        <h1 className={styles.title}>{p.title}</h1>

        <div className={styles.icons}>
          <button
            className={`${styles.heart} ${
              isWishlisted ? styles.heartActive : ""
            }`}
            onClick={toggleWishlist}
            title={isWishlisted ? "In wishlist" : "Add to wishlist"}
          >
            <svg viewBox="0 0 24 24" className={styles.heartIcon} aria-hidden>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>

          <button
            className={styles.shareBtn}
            onClick={handleShare}
            title="Share"
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
        </div>
      </div>

      <div className={styles.subtitleSmall}>{p.subtitle}</div>

      <div className={styles.rating} aria-hidden>
        <div className={styles.stars}>{renderStars()}</div>
        <div className={styles.ratingNum}>
          {Number(p.ratingValue).toFixed(1)} ({p.ratingCount})
        </div>
      </div>

      <hr className={styles.sep} />

      <div className={styles.optionSection}>
        {/* Metal type, chips, shapes (unchanged) */}
        <div className={styles.optionRow}>
          <div className={styles.label}>Metal Type :</div>
          <div className={styles.selectedLabel}>{selectedMetalLabel}</div>
        </div>

        <div className={styles.chips} role="list" aria-label="Metal options">
          {p.metals.map((m) => {
            const active = selectedMetal === m.key;
            return (
              <button
                key={m.key}
                type="button"
                role="listitem"
                data-metal={m.key}
                className={`${styles.chip} ${active ? styles.chipActive : ""}`}
                onClick={() => handleMetalClick(m)}
                aria-pressed={active}
                title={m.fullLabel ?? m.label}
              >
                <span className={styles.chipInner}>
                  <span className={styles.chipLabel}>{m.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 12 }}>
          <div className={styles.optionRow}>
            <div className={styles.label}>Stone Shape :</div>
            <div className={styles.selectedLabel}>{selectedShapeLabel}</div>
          </div>

          <div
            className={styles.shapeRow}
            role="list"
            aria-label="Stone shapes"
          >
            {p.shapes.map((s) => {
              const active = selectedShape === s.key;
              const src = `/images/shapes/${s.key}.svg`;
              return (
                <button
                  key={s.key}
                  type="button"
                  className={`${styles.shapeBtn} ${
                    active ? styles.shapeBtnActive : ""
                  }`}
                  onClick={() => setSelectedShape(s.key)}
                  aria-pressed={active}
                  title={s.label}
                >
                  <img src={src} alt={s.label} className={styles.shapeImg} />
                </button>
              );
            })}
          </div>
        </div>

        {/* ------------- CENTRE STONE ROW ------------- */}
        <div style={{ marginTop: 18 }}>
          <div className={styles.optionRow}>
            <div className={styles.label}>Centre Stone :</div>
            <div className={styles.selectedLabel}>{selectedCentreStone}</div>
          </div>

          {/* IMPORTANT: caratWrap contains two children:
              - caratScroll (the horizontally-scrollable chips)
              - caratAction (the fixed Full inventory button on the right)
             This keeps the full-inventory button visible while chips scroll.
          */}
          <div className={styles.caratWrap}>
            <div
              className={styles.caratScroll}
              role="list"
              aria-label="Centre stones"
            >
              {p.centreStones.map((c, idx) => {
                const active = selectedCentreStone === c;
                return (
                  <button
                    key={String(c) + idx}
                    type="button"
                    className={`${styles.caratChip} ${
                      active ? styles.caratChipActive : ""
                    }`}
                    onClick={() => setSelectedCentreStone(c)}
                    aria-pressed={active}
                  >
                    <span className={styles.caratLabel}>{c}</span>
                  </button>
                );
              })}
            </div>

            <div className={styles.caratAction}>
              <button
                type="button"
                onClick={handleFullInventory}
                className={styles.fullInventoryBtn}
                aria-label="Full inventory"
              >
                Full inventory
              </button>
            </div>
          </div>
        </div>

        {/* rest unchanged (ring size, engraving, price, Add to Bag CTA etc.) */}
        <div
          className={styles.optionRow}
          style={{ marginTop: 18, alignItems: "center" }}
        >
          <div className={styles.label}>Select Ring Size</div>

          <div className={styles.customSelectWrap} ref={ringRef}>
            <button
              type="button"
              className={styles.customSelectButton}
              onClick={() => setRingOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={ringOpen}
            >
              <span className={styles.customSelectLabel}>
                {String(selectedRingSize)}
              </span>
              <span className={styles.customSelectChevron}>▾</span>
            </button>

            {ringOpen && (
              <ul
                className={styles.customSelectList}
                role="listbox"
                aria-label="Ring sizes"
              >
                {p.ringSizes.map((rs, idx) => (
                  <li
                    key={String(rs) + idx}
                    role="option"
                    aria-selected={String(selectedRingSize) === String(rs)}
                    className={styles.customSelectItem}
                    onClick={() => {
                      setSelectedRingSize(rs);
                      setRingOpen(false);
                    }}
                  >
                    <span>{rs}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ marginLeft: "12px", fontSize: 16 }}>
            <a href="#ring-size-help" className={styles.ringHelpLink}>
              Ring Size Help
            </a>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <button className={styles.engraveBtn}>+ Add Free Engraving</button>
        </div>

        <div style={{ marginTop: 18 }} className={styles.priceSection}>
          <div className={styles.priceLeft}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className={styles.priceOld}>{p.originalPrice}</div>
              <div className={styles.priceNew}>{p.price}</div>
              <div className={styles.settingPriceNote}>( Setting Price )</div>
              {p.discountPct ? (
                <span className={styles.discountBadge}>-{p.discountPct}%</span>
              ) : null}
            </div>
            <div className={styles.priceNote}>
              * Discount Coupon Is Applied Automatically
            </div>
          </div>

          <div style={{ marginTop: 18, padding: 10 }}>
            <Button
              label="Add to Bag"
              bgColor="#A54EA8"
              textColor="#fff"
              width="100%"
              height="48px"
              borderRadius="8px"
              onClick={handleAddToBag}
            />
          </div>

          <div className={styles.shipRow} style={{ marginTop: 16 }}>
            <div className={styles.shipIcon} aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24">
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
            </div>
            <div style={{ marginLeft: 10, color: "rgba(0,0,0,0.8)" }}>
              {p.shippingDateStr}
            </div>
          </div>
        </div>

        <hr className={styles.sep} />

        <div className={styles.featuresHeading}>Your Order Includes</div>

        <div
          className={styles.featuresList}
          aria-live="polite"
          style={{ marginTop: 8 }}
        >
          {p.features?.freeShipping && (
            <div className={styles.featureItem}>
              <div
                className={`${styles.featureIcon} ${styles.featureIconColored}`}
                aria-hidden
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
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
                  We're committed to making your entire experience a pleasant
                  one, from shopping to shipping.
                </div>
              </div>
            </div>
          )}

          {p.features?.freeReturns && (
            <div className={styles.featureItem}>
              <div
                className={`${styles.featureIcon} ${styles.featureIconColored}`}
                aria-hidden
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="11" />
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
          )}
        </div>

        <div className={styles.accordion}>
          {p.detailsSections.map((row, idx) => {
            const isOpen = accOpen === idx;
            return (
              <div className={styles.accItem} key={idx}>
                <button
                  type="button"
                  className={styles.accHeader}
                  onClick={() => toggleAcc(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`acc-body-${idx}`}
                  id={`acc-header-${idx}`}
                >
                  <span>{row.title}</span>
                  <span className={styles.accToggle} aria-hidden>
                    <span className={styles.accIcon}>{isOpen ? "−" : "+"}</span>
                  </span>
                </button>

                <div
                  id={`acc-body-${idx}`}
                  className={`${styles.accBodyWrap} ${
                    isOpen ? styles.accBodyWrapOpen : ""
                  }`}
                  role="region"
                  aria-labelledby={`acc-header-${idx}`}
                >
                  <div className={styles.accBody}>
                    {typeof row.body === "string" ? (
                      <div style={{ whiteSpace: "pre-wrap" }}>{row.body}</div>
                    ) : (
                      row.body
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
