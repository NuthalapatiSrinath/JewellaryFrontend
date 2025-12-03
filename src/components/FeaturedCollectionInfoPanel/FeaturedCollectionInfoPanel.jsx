import React, { useEffect, useRef, useState } from "react";
import ProductTabSelector from "../ProductTabSelector/ProductTabSelector"; // adjust path
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";
import styles from "./FeaturedCollectionInfoPanel.module.css";

export default function FeaturedCollectionInfoPanel({
  product = {},
  isWishlistedInitial = false,
  onToggleWishlist,
  onShare,
  onSelectMetal,
  onSelectCarat,
  onSelectShape,
  onAddToCart,
  onBuyNow,
}) {
  const {
    id,
    title = "Solitaire Diamond Engagement Ring",
    subtitle: subtitleFromProp,
    rating = { value: 4.5, count: 450 },
    url,
    metals = [
      { key: "14k_yellow", label: "14K", fullLabel: "14K Yellow Gold" },
      { key: "14k_white", label: "14K", fullLabel: "14K White Gold" },
      { key: "14k_rose", label: "14K", fullLabel: "14K Rose Gold" },
      { key: "18k", label: "18K", fullLabel: "18K Yellow Gold" },
      { key: "pt", label: "Pt", fullLabel: "Platinum (Pt)" },
    ],
    carats = [1, 1.5, 2, 2.5],
    shapes = [
      { key: "round", label: "Round" },
      { key: "oval", label: "Oval" },
      { key: "marquise", label: "Marquise" },
    ],
    diamondTabs = ["Natural", "Lab grown"],
    features = { freeShipping: true, freeReturns: true },
    price,
    originalPrice,
    discountPercentage: explicitDiscount,
    ringSizes = ["Select Ring Size", 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7],
  } = product;

  // inline fill map (bypass CSS module scoping problems)
  const metalFill = {
    "14k_yellow": "#ECD9B3",
    "14k_white": "#E9E9E9",
    "14k_rose": "#F2D7D2",
    "18k": "#E8D5B0",
    pt: "#F6DCDC",
  };

  const [selectedMetal, setSelectedMetal] = useState(metals?.[0]?.key ?? null);
  const [selectedCarat, setSelectedCarat] = useState(carats?.[0] ?? null);
  const [selectedShape, setSelectedShape] = useState(shapes?.[0]?.key ?? null);
  const [selectedRingSize, setSelectedRingSize] = useState(
    ringSizes && ringSizes.length > 0 ? ringSizes[0] : ""
  );
  const navigate = useNavigate();

  const storageKey = id ? `wishlist_product_${id}` : null;
  const [isWishlisted, setIsWishlisted] = useState(() => {
    try {
      if (storageKey && typeof window !== "undefined") {
        return localStorage.getItem(storageKey) === "true";
      }
    } catch {}
    return !!isWishlistedInitial;
  });

  const initialIndex =
    Array.isArray(diamondTabs) && diamondTabs.indexOf(subtitleFromProp) >= 0
      ? diamondTabs.indexOf(subtitleFromProp)
      : 0;
  const [activeDiamondIndex, setActiveDiamondIndex] = useState(initialIndex);
  const [subtitle, setSubtitle] = useState(diamondTabs[initialIndex] ?? "");

  useEffect(() => {
    if (Array.isArray(diamondTabs) && diamondTabs[activeDiamondIndex]) {
      setSubtitle(diamondTabs[activeDiamondIndex]);
    }
  }, [activeDiamondIndex, diamondTabs]);

  useEffect(() => {
    setSelectedMetal((m) =>
      metals?.some((x) => x.key === m) ? m : metals?.[0]?.key ?? null
    );
    setSelectedCarat((c) => (carats?.includes(c) ? c : carats?.[0] ?? null));
    setSelectedShape((s) =>
      shapes?.some((x) => x.key === s) ? s : shapes?.[0]?.key ?? null
    );

    const idx = Array.isArray(diamondTabs)
      ? diamondTabs.indexOf(subtitleFromProp)
      : -1;
    if (idx >= 0) {
      setActiveDiamondIndex(idx);
      setSubtitle(diamondTabs[idx]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const toggleWishlist = () => {
    const next = !isWishlisted;
    setIsWishlisted(next);
    try {
      if (storageKey) localStorage.setItem(storageKey, next ? "true" : "false");
    } catch {}
    onToggleWishlist?.(next, product);
  };

  const handleShare = async () => {
    const shareUrl =
      url || (typeof window !== "undefined" ? window.location.href : "");
    try {
      if (navigator.share) {
        await navigator.share({ title, text: subtitle, url: shareUrl });
        onShare?.(product);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        if (typeof window !== "undefined")
          window.alert("Link copied to clipboard");
        onShare?.(product);
      }
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  const chooseMetal = (key) => {
    setSelectedMetal(key);
    onSelectMetal?.(key);
  };
  const chooseCarat = (c) => {
    setSelectedCarat(c);
    onSelectCarat?.(c);
  };
  const chooseShape = (k) => {
    setSelectedShape(k);
    onSelectShape?.(k);
  };

  const handleTabChange = (index) => {
    setActiveDiamondIndex(index);
  };
  const [openAcc, setOpenAcc] = useState(null);
  const toggleAcc = (idx) => setOpenAcc((prev) => (prev === idx ? null : idx));

  const toNumber = (v) => {
    if (typeof v === "number") return v;
    if (typeof v === "string") {
      const parsed = parseFloat(v.replace(/[^0-9.\-]/g, ""));
      if (!isNaN(parsed)) return parsed;
    }
    return undefined;
  };
  const listPriceNum =
    toNumber(originalPrice) ??
    toNumber(product.listPrice) ??
    toNumber(product.compareAtPrice);
  const currentPriceNum = toNumber(price) ?? listPriceNum;
  let computedDiscountPct = explicitDiscount;
  if (
    computedDiscountPct == null &&
    listPriceNum &&
    currentPriceNum &&
    listPriceNum > currentPriceNum
  ) {
    computedDiscountPct = Math.round(
      ((listPriceNum - currentPriceNum) / listPriceNum) * 100
    );
  }
  const formatMoney = (v) => {
    if (v == null) return "";
    if (typeof v === "string" && v.trim() !== "") return v;
    const n = Number(v);
    if (Number.isNaN(n)) return "";
    return n.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
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

  const [ringOpen, setRingOpen] = useState(false);
  const ringRef = useRef(null);
  useEffect(() => {
    function onDocClick(e) {
      if (!ringRef.current) return;
      if (!ringRef.current.contains(e.target)) setRingOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const displayedRingLabel =
    selectedRingSize === undefined ||
    selectedRingSize === null ||
    (typeof selectedRingSize === "string" &&
      selectedRingSize.toLowerCase().includes("select"))
      ? String(ringSizes[0] ?? "Select Ring Size")
      : String(selectedRingSize);

  const handleAddToCart = () => {
    onAddToCart?.(product, {
      metal: selectedMetal,
      carat: selectedCarat,
      shape: selectedShape,
      diamondType: subtitle,
      ringSize: selectedRingSize,
    });
    navigate("/cart");
  };

  const handleBuyNow = () => {
    onBuyNow?.(product, {
      metal: selectedMetal,
      carat: selectedCarat,
      shape: selectedShape,
      diamondType: subtitle,
      ringSize: selectedRingSize,
    });
    navigate("/cart");
  };

  const getShapeSrc = (shapeKey) => `/images/shapes/${shapeKey}.svg`;
  const renderStars = () => {
    const value = Number(rating?.value ?? 0);
    const arr = [];
    for (let i = 1; i <= 5; i++) {
      const frac = Math.max(0, Math.min(1, value - (i - 1)));
      const fillPct = Math.round(frac * 100);
      arr.push(
        <span key={i} className={styles.starWrap} aria-hidden>
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path
              d="M12 .587l3.668 7.571L24 9.423l-6 5.854L19.335 24 12 19.771 4.665 24 6 15.277 0 9.423l8.332-1.265z"
              fill="#DADADA"
            />
          </svg>
          {fillPct > 0 && (
            <span
              className={styles.starFill}
              style={{ width: `${fillPct}%` }}
              aria-hidden
            >
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

  const selectedMetalObj = metals.find((m) => m.key === selectedMetal);
  const selectedMetalLabel =
    selectedMetalObj?.fullLabel ?? selectedMetalObj?.label ?? "";

  return (
    <div
      className={styles.panel}
      aria-label="Product info panel (header + options)"
    >
      <div className={styles.headerRow}>
        <h1 className={styles.title}>{title}</h1>

        <div className={styles.icons}>
          <button
            type="button"
            className={`${styles.heart} ${
              isWishlisted ? styles.heartActive : ""
            }`}
            onClick={toggleWishlist}
            aria-pressed={isWishlisted}
            title={isWishlisted ? "In wishlist" : "Add to wishlist"}
          >
            <svg viewBox="0 0 24 24" className={styles.heartIcon} aria-hidden>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>

          <button
            type="button"
            className={styles.shareBtn}
            onClick={handleShare}
            aria-label="Share"
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

      <div className={styles.subtitleSmall}>{subtitle}</div>

      <div className={styles.rating} aria-hidden>
        <div className={styles.stars}>{renderStars()}</div>
        <div className={styles.ratingNum}>
          {Number(rating.value).toFixed(1)} ({rating.count ?? 450})
        </div>
      </div>

      <hr className={styles.sep} />

      <div className={styles.optionSection}>
        {/* Metal */}
        <div className={styles.optionRow}>
          <div className={styles.label}>Metal Type :</div>
          <div className={styles.selectedLabel}>{selectedMetalLabel}</div>
        </div>
        <div className={styles.chips} role="list" aria-label="Metal options">
          {metals.map((m) => {
            const active = selectedMetal === m.key;
            const fillColor = metalFill[m.key] ?? "#E9E9E9";

            return (
              <button
                key={m.key}
                type="button"
                role="listitem"
                data-metal={m.key}
                className={`${styles.chip} ${active ? styles.chipActive : ""}`}
                onClick={() => chooseMetal(m.key)}
                aria-pressed={active}
                title={m.fullLabel ?? m.label}
              >
                <span
                  className={styles.chipInner}
                  // dynamic: set background and a CSS variable --ring-color for pseudo elements
                  style={{
                    background: fillColor,
                    /* custom property name must be quoted as string */
                    ["--ring-color"]: fillColor,
                  }}
                >
                  <span className={styles.chipLabel}>{m.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Carat */}
        <div className={styles.optionRow} style={{ marginTop: 18 }}>
          <div className={styles.label}>Total Carat weight :</div>
          <div className={styles.selectedLabel}>
            {selectedCarat ? `${selectedCarat} ct. tw` : ""}
          </div>
        </div>
        <div className={styles.chips} role="list" aria-label="Carat options">
          {carats.map((c) => {
            const active = selectedCarat === c;
            return (
              <button
                key={String(c)}
                type="button"
                role="listitem"
                className={`${styles.chip} ${styles.carat} ${
                  active ? styles.chipActive : ""
                }`}
                onClick={() => chooseCarat(c)}
                aria-pressed={active}
                title={`${c}`}
              >
                <span className={styles.caratLabel}>{c}</span>
              </button>
            );
          })}
        </div>

        {/* Shape */}
        <div className={styles.optionRow} style={{ marginTop: 18 }}>
          <div className={styles.label}>Shape :</div>
          <div className={styles.selectedLabel}>
            {shapes.find((s) => s.key === selectedShape)?.label ?? ""}
          </div>
        </div>
        <div className={styles.chips} role="list" aria-label="Shape options">
          {shapes.map((s) => {
            const active = selectedShape === s.key;
            const src = getShapeSrc(s.key);
            return (
              <button
                key={s.key}
                type="button"
                role="listitem"
                className={`${styles.chip} ${styles.shapeChip} ${
                  active ? styles.chipActive : ""
                }`}
                onClick={() => chooseShape(s.key)}
                aria-pressed={active}
                title={s.label}
              >
                <span className={styles.shapeInner}>
                  <img
                    src={src}
                    alt={s.label}
                    className={styles.shapeIcon}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </span>
              </button>
            );
          })}
        </div>

        <div className={styles.diamondTypeRow}>
          <div className={styles.label}>Diamond Type :</div>
          <div className={styles.selectedLabel}>{subtitle}</div>
        </div>

        <div style={{ marginTop: 10 }}>
          <ProductTabSelector
            tabs={diamondTabs}
            activeIndex={activeDiamondIndex}
            onTabChange={handleTabChange}
          />
        </div>

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
                {displayedRingLabel}
              </span>
              <span className={styles.customSelectChevron} aria-hidden>
                ▾
              </span>
            </button>

            {ringOpen && (
              <ul
                className={styles.customSelectList}
                role="listbox"
                aria-label="Ring sizes"
              >
                {ringSizes.map((r, idx) => (
                  <li
                    key={String(r) + idx}
                    role="option"
                    aria-selected={String(selectedRingSize) === String(r)}
                    className={styles.customSelectItem}
                    onClick={() => {
                      const num = parseFloat(String(r));
                      setSelectedRingSize(Number.isFinite(num) ? num : r);
                      setRingOpen(false);
                    }}
                  >
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div
            style={{
              marginLeft: "12px",
              fontSize: 18,
              color: "rgba(0,0,0,0.85)",
            }}
          >
            <a href="#ring-size-help" className={styles.ringHelpLink}>
              Ring Size Help
            </a>
          </div>
        </div>

        {/* Price & CTAs */}
        <div style={{ marginTop: 18 }}>
          <div className={styles.priceRow}>
            <div className={styles.priceLeft}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {listPriceNum ? (
                  <div className={styles.priceOriginal}>
                    {formatMoney(listPriceNum)}
                  </div>
                ) : null}
                <div className={styles.priceCurrent}>
                  {formatMoney(currentPriceNum)}
                </div>
                <div className={styles.settingPriceNote}>( Setting Price )</div>
                {computedDiscountPct ? (
                  <span className={styles.discountBadge}>
                    -{computedDiscountPct}%
                  </span>
                ) : null}
              </div>
              <div className={styles.priceNote}>
                * Discount Coupon Is Applied Automatically
              </div>
            </div>

            <div className={styles.priceActions}>
              <Button
                label="Add to cart"
                bgColor="#fff"
                textColor="#A54EA8"
                borderColor="rgba(165,78,168,0.14)"
                width="100%"
                height="48px"
                borderRadius="10px"
                padding="0 28px"
                onClick={handleAddToCart}
              />
              <Button
                label="Buy Now"
                bgColor="#A54EA8"
                textColor="#fff"
                width="100%"
                height="48px"
                borderRadius="10px"
                padding="0 28px"
                onClick={handleBuyNow}
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className={styles.featureItem} style={{ marginTop: 18 }}>
          <div className={styles.featureIcon} aria-hidden>
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
          <div className={styles.featureContent}>
            <div className={styles.featureTitle}>
              Ships by {shippingDateStr}
            </div>
          </div>
        </div>

        <div className={styles.featuresHeading}>Your order includes</div>
        {(features?.freeShipping || features?.freeReturns) && (
          <div
            className={styles.featuresList}
            aria-live="polite"
            style={{ marginTop: 8 }}
          >
            {features.freeShipping && (
              <div className={styles.featureItem}>
                <div className={styles.featureIcon} aria-hidden>
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
                    We’re committed to making your entire experience a pleasant
                    one, from shopping to shipping.
                  </div>
                </div>
              </div>
            )}
            {features.freeReturns && (
              <div className={styles.featureItem}>
                <div className={styles.featureIcon} aria-hidden>
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
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
                    Our commitment to you does not end at delivery. We offer
                    free returns to make your experience as easy as possible.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Accordion */}
      <div className={styles.accordion} aria-live="polite">
        {(
          product.detailsSections || [
            { title: "Product details", body: product.description ?? "ss." },
            {
              title: "Secure Shopping",
              body:
                product.secureShopping ??
                "We use secure payment methods and encrypted connections to protect your purchase.",
            },
            {
              title: "Life Time Product Warranty",
              body:
                product.lifecycleWarranty ??
                "We provide lifetime warranty on workmanship and manufacturing defects.",
            },
            {
              title: "About Gemstone And Diamonds",
              body:
                product.gemInfo ??
                "Detailed information about gemstones and diamonds for this product.",
            },
          ]
        ).map((row, idx) => {
          const isOpen = openAcc === idx;
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
  );
}
