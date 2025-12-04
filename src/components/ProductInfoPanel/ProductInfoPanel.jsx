import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Components
import Button from "../Button/Button";

// Services & API
import { addToCartRTS } from "../../api/cartService";
import {
  addProductToWishlist,
  deleteWishlistItem,
} from "../../api/wishlistService";
import { fetchRtsVariants } from "../../api/productsService";

// Redux Actions
import { fetchWishlist } from "../../redux/slices/wishlistSlice";
import { openModal } from "../../redux/slices/modalSlice";
import { isLoggedIn } from "../../utils/userAuth";

// Styles
import styles from "./ProductInfoPanel.module.css";

// --- 🛠️ HELPERS: Backend Code Mappers ---

const getMetalLabel = (code) => {
  const map = {
    "14R": "14K Rose Gold",
    "14Y": "14K Yellow Gold",
    "14W": "14K White Gold",
    "18Y": "18K Yellow Gold",
    "18W": "18K White Gold",
    "18R": "18K Rose Gold",
    PT: "Platinum",
    P: "Platinum",
  };
  return map[code] || code;
};

// Helper to generate a CSS-friendly key for the metal color ring
const getMetalStyleKey = (code) => {
  if (!code) return "default";
  const c = code.toUpperCase();
  if (c.includes("14R") || c.includes("ROSE")) return "14k_rose";
  if (c.includes("14Y") || c.includes("YELLOW")) return "14k_yellow";
  if (c.includes("14W") || c.includes("WHITE")) return "14k_white";
  if (c.includes("18Y")) return "18k";
  if (c.includes("18W")) return "18k_white"; // Ensure CSS exists or map to 14k_white style
  if (c.includes("P")) return "pt";
  return "default";
};

const getShapeLabel = (code) => {
  const map = {
    RND: "Round",
    OVL: "Oval",
    MAR: "Marquise",
    PRN: "Princess",
    EMR: "Emerald",
    CUS: "Cushion",
    PER: "Pear",
    RAD: "Radiant",
    HRT: "Heart",
    ASC: "Asscher",
  };
  return map[code] || code;
};

// Map backend shape code to local static image file
const getShapeImageSrc = (code) => {
  const map = {
    RND: "round",
    OVL: "oval",
    MAR: "marquise",
    PRN: "princess",
    EMR: "emerald",
    CUS: "cushion",
    PER: "pear",
    RAD: "radient",
    HRT: "heart",
    ASC: "asscher",
  };
  const filename = map[code] || code?.toLowerCase();
  return `/images/shapes/${filename}.svg`;
};

export default function ProductInfoPanel({ product = {}, onShare }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux Wishlist State
  const wishlistItems = useSelector((state) => state.wishlist.items);

  // --- 1. Destructure Default Product Data ---
  const {
    id, // This should be the product ID
    productSku,
    title = "Solitaire Diamond Engagement Ring",
    rating = { value: 4.5, count: 450 },
    url,
    features = { freeShipping: true, freeReturns: true },
    price: defaultPrice, // The default price from the main product object
    originalPrice,
    discountPercentage,
    description,
    secureShopping,
    lifecycleWarranty,
    gemInfo,
  } = product;

  // Ensure we have a valid ID (handle _id vs id)
  const productId = product._id || product.id;

  // --- 2. State for Dynamic API Options ---
  const [availableMetals, setAvailableMetals] = useState([]);
  const [availableShapes, setAvailableShapes] = useState([]);
  const [availableCarats, setAvailableCarats] = useState([]);
  const [availableRingSizes, setAvailableRingSizes] = useState([]); // From API

  const [allVariants, setAllVariants] = useState([]); // Full list of variants
  const [loadingVariants, setLoadingVariants] = useState(false);

  // --- 3. State for User Selections ---
  const [selectedMetal, setSelectedMetal] = useState(null);
  const [selectedCarat, setSelectedCarat] = useState(null);
  const [selectedShape, setSelectedShape] = useState(null);
  const [selectedRingSize, setSelectedRingSize] = useState(null);

  // --- 4. Computed State (Matched Variant) ---
  const [currentVariant, setCurrentVariant] = useState(null);
  const [displayPrice, setDisplayPrice] = useState(defaultPrice);
  const [diamondType, setDiamondType] = useState("Natural"); // Default, updated by variant

  const [isAddingCart, setIsAddingCart] = useState(false);

  // Wishlist Status
  const wishlistItem = wishlistItems.find((item) => item.id === productId);
  const isWishlisted = !!wishlistItem;

  // --- 5. FETCH DATA ON MOUNT ---
  useEffect(() => {
    if (!productId) return;

    const loadVariants = async () => {
      setLoadingVariants(true);
      try {
        // Call the API to get variants and summary
        const data = await fetchRtsVariants(productId);

        if (data && data.variants) {
          setAllVariants(data.variants);

          // Use VariantSummary to populate chips
          if (data.VariantSummary && data.VariantSummary.length > 0) {
            const summary = data.VariantSummary[0];

            // --- Shapes ---
            if (summary.availableShapes?.length > 0) {
              const shapes = summary.availableShapes.map((code) => ({
                key: code,
                label: getShapeLabel(code),
              }));
              setAvailableShapes(shapes);
              // Default Select
              if (!selectedShape) setSelectedShape(shapes[0].key);
            }

            // --- Metals ---
            if (summary.metalTypes?.length > 0) {
              const metals = summary.metalTypes.map((code) => ({
                key: code,
                styleKey: getMetalStyleKey(code),
                label:
                  code.replace(/[0-9]/g, "") === "P" ? "Pt" : code.slice(0, 3),
                fullLabel: getMetalLabel(code),
              }));
              setAvailableMetals(metals);
              if (!selectedMetal) setSelectedMetal(metals[0].key);
            }

            // --- Carats ---
            if (summary.centerStoneWeights?.length > 0) {
              const carats = summary.centerStoneWeights.sort((a, b) => a - b);
              setAvailableCarats(carats);
              if (!selectedCarat) setSelectedCarat(carats[0]);
            }

            // --- Ring Sizes (Strictly from API) ---
            if (summary.ringSizes && summary.ringSizes.length > 0) {
              const sizes = summary.ringSizes.sort((a, b) => a - b);
              setAvailableRingSizes(sizes);
              setSelectedRingSize(sizes[0]);
            } else {
              setAvailableRingSizes([]); // Explicitly empty if API doesn't send it
            }

            // --- Diamond Type (Base) ---
            if (summary.diamondType) {
              setDiamondType(summary.diamondType);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load variants", err);
      } finally {
        setLoadingVariants(false);
      }
    };
    loadVariants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // --- 6. MATCH LOGIC: Update Price & Variant Details ---
  useEffect(() => {
    if (!allVariants.length) return;

    // Filter variants based on current selection
    const found = allVariants.find(
      (v) =>
        (v.metalCode === selectedMetal || v.metalType === selectedMetal) &&
        v.shape_code === selectedShape &&
        v.centerStoneWeight === Number(selectedCarat)
    );

    setCurrentVariant(found || null);

    if (found) {
      // Update UI with Variant Details
      setDisplayPrice(found.totalPrice);
      if (found.diamondType) setDiamondType(found.diamondType);
    } else {
      // Optional: Reset to base price or show error state in UI
    }
  }, [selectedMetal, selectedShape, selectedCarat, allVariants]);

  // --- 🛒 ADD TO CART HANDLER ---
  const handleAddToCartAction = async (redirect = false) => {
    if (!isLoggedIn()) {
      dispatch(openModal({ type: "AUTH" }));
      return;
    }

    if (!currentVariant) {
      alert("This specific combination is currently unavailable.");
      return;
    }

    setIsAddingCart(true);
    try {
      const payload = {
        // Send precise details from the matched variant
        productSku: currentVariant.productSku || productSku,
        metalCode: currentVariant.metalCode || selectedMetal,
        shapeCode: currentVariant.shape_code || selectedShape,
        centerStoneWeight:
          currentVariant.centerStoneWeight || Number(selectedCarat),
        quantity: 1,
        // Include ring size if API accepts it (even if not in variant match logic)
        ringSize: selectedRingSize,
      };

      console.log("🚀 Adding to Cart:", payload);
      const res = await addToCartRTS(payload);

      if (res.success) {
        if (redirect) navigate("/checkout");
        else alert("Item added to cart successfully!");
      } else {
        alert("Failed: " + (res.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Cart Error:", error);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setIsAddingCart(false);
    }
  };

  // --- ❤️ WISHLIST HANDLER ---
  const handleToggleWishlist = async () => {
    if (!isLoggedIn()) {
      dispatch(openModal({ type: "AUTH" }));
      return;
    }
    try {
      if (isWishlisted) {
        await deleteWishlistItem(wishlistItem.wishlistId);
      } else {
        await addProductToWishlist({
          productId,
          productSku: productSku || "RING-001",
        });
      }
      dispatch(fetchWishlist());
    } catch (error) {
      console.error("Wishlist error", error);
    }
  };

  // --- UI Helpers ---
  const handleShare = async () => {
    const shareUrl = url || window.location.href;
    if (navigator.share) {
      await navigator.share({
        title,
        text: "Check out this ring!",
        url: shareUrl,
      });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied!");
    }
    onShare?.(product);
  };

  // Format Price
  const formatMoney = (v) => {
    if (!v || isNaN(Number(v))) return "";
    return Number(v).toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
  };

  // Prices for Display
  const listPriceNum = originalPrice || product.listPrice;
  const currentPriceNum = displayPrice; // This updates when variant changes

  // Discount Badge Logic
  let computedDiscountPct = discountPercentage;
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

  // Ring Size Dropdown
  const [ringOpen, setRingOpen] = useState(false);
  const ringRef = useRef(null);
  useEffect(() => {
    const onClick = (e) =>
      ringRef.current &&
      !ringRef.current.contains(e.target) &&
      setRingOpen(false);
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Logic for Ring Size Label
  const showRingSizes = availableRingSizes && availableRingSizes.length > 0;
  const displayedRingLabel = showRingSizes
    ? selectedRingSize
      ? String(selectedRingSize)
      : "Select Size"
    : "Not available from API";

  // Accordion Logic
  const [openAcc, setOpenAcc] = useState(null);
  const toggleAcc = (idx) => setOpenAcc((prev) => (prev === idx ? null : idx));

  // Data for Accordion (Static + API Data)
  const accordionRows = product.detailsSections || [
    {
      title: "Product details",
      body: description || "Beautiful Engagement Ring",
    },
    {
      title: "Secure Shopping",
      body: secureShopping || "We use secure payment methods.",
    },
    {
      title: "Life Time Warranty",
      body: lifecycleWarranty || "Lifetime warranty on defects.",
    },
    { title: "Gemstone Info", body: gemInfo || "Ethically sourced diamonds." },
  ];

  // Helper for Metal Label display
  const selectedMetalLabel =
    availableMetals.find((m) => m.key === selectedMetal)?.fullLabel ||
    selectedMetal ||
    "";

  // Helper for Stars
  const renderStars = () => {
    const arr = [];
    for (let i = 1; i <= 5; i++) {
      const fillPct = Math.round(
        Math.max(0, Math.min(1, (rating?.value || 0) - (i - 1))) * 100
      );
      arr.push(
        <span key={i} className={styles.starWrap}>
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path
              d="M12 .587l3.668 7.571L24 9.423l-6 5.854L19.335 24 12 19.771 4.665 24 6 15.277 0 9.423l8.332-1.265z"
              fill="#DADADA"
            />
          </svg>
          {fillPct > 0 && (
            <span className={styles.starFill} style={{ width: `${fillPct}%` }}>
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

  return (
    <div className={styles.panel}>
      {/* Header */}
      <div className={styles.headerRow}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.icons}>
          <button
            type="button"
            className={`${styles.heart} ${
              isWishlisted ? styles.heartActive : ""
            }`}
            onClick={handleToggleWishlist}
          >
            <svg viewBox="0 0 24 24" className={styles.heartIcon}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
          <button
            type="button"
            className={styles.shareBtn}
            onClick={handleShare}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
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

      {/* Subtitle / Diamond Type */}
      <div className={styles.subtitleSmall}>{diamondType} Diamond</div>

      <div className={styles.rating}>
        <div className={styles.stars}>{renderStars()}</div>
        <div className={styles.ratingNum}>
          {Number(rating.value).toFixed(1)} ({rating.count})
        </div>
      </div>
      <hr className={styles.sep} />

      {/* --- OPTIONS SECTION (Dynamic) --- */}
      <div className={styles.optionSection}>
        {/* 1. METAL */}
        {availableMetals.length > 0 && (
          <>
            <div className={styles.optionRow}>
              <div className={styles.label}>Metal Type :</div>
              <div className={styles.selectedLabel}>{selectedMetalLabel}</div>
            </div>
            <div className={styles.chips}>
              {availableMetals.map((m) => (
                <button
                  key={m.key}
                  // data-metal maps to CSS for the colored ring
                  data-metal={m.styleKey}
                  className={`${styles.chip} ${
                    selectedMetal === m.key ? styles.chipActive : ""
                  }`}
                  onClick={() => setSelectedMetal(m.key)}
                  title={m.fullLabel}
                >
                  <span className={styles.chipInner}>
                    <span className={styles.chipLabel}>{m.label}</span>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* 2. CARAT */}
        {availableCarats.length > 0 && (
          <>
            <div className={styles.optionRow} style={{ marginTop: 18 }}>
              <div className={styles.label}>Total Carat weight :</div>
              <div className={styles.selectedLabel}>{selectedCarat} ct. tw</div>
            </div>
            <div className={styles.chips}>
              {availableCarats.map((c) => (
                <button
                  key={String(c)}
                  className={`${styles.chip} ${styles.carat} ${
                    selectedCarat === c ? styles.chipActive : ""
                  }`}
                  onClick={() => setSelectedCarat(c)}
                >
                  <span className={styles.caratLabel}>{c}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* 3. SHAPE */}
        {availableShapes.length > 0 && (
          <>
            <div className={styles.optionRow} style={{ marginTop: 18 }}>
              <div className={styles.label}>Shape :</div>
              <div className={styles.selectedLabel}>
                {availableShapes.find((s) => s.key === selectedShape)?.label}
              </div>
            </div>
            <div className={styles.chips}>
              {availableShapes.map((s) => (
                <button
                  key={s.key}
                  className={`${styles.chip} ${styles.shapeChip} ${
                    selectedShape === s.key ? styles.chipActive : ""
                  }`}
                  onClick={() => setSelectedShape(s.key)}
                  title={s.label}
                >
                  <span className={styles.shapeInner}>
                    {/* Static image from public folder based on dynamic code */}
                    <img
                      src={getShapeImageSrc(s.key)}
                      alt={s.label}
                      className={styles.shapeIcon}
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* 4. RING SIZE (If available from API) */}
        <div
          className={styles.optionRow}
          style={{ marginTop: 18, alignItems: "center" }}
        >
          <div className={styles.label}>Select Ring Size</div>
          <div className={styles.customSelectWrap} ref={ringRef}>
            <button
              type="button"
              className={styles.customSelectButton}
              // Disable if no sizes from API
              disabled={!showRingSizes}
              onClick={() => showRingSizes && setRingOpen(!ringOpen)}
              style={{
                opacity: showRingSizes ? 1 : 0.6,
                cursor: showRingSizes ? "pointer" : "not-allowed",
              }}
            >
              <span className={styles.customSelectLabel}>
                {displayedRingLabel}
              </span>
              <span className={styles.customSelectChevron}>▾</span>
            </button>

            {ringOpen && showRingSizes && (
              <ul className={styles.customSelectList}>
                {availableRingSizes.map((r, idx) => (
                  <li
                    key={idx}
                    className={styles.customSelectItem}
                    onClick={() => {
                      setSelectedRingSize(r);
                      setRingOpen(false);
                    }}
                  >
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 5. PRICES & BUTTONS */}
        <div style={{ marginTop: 18 }}>
          <div className={styles.priceRow}>
            <div className={styles.priceLeft}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {listPriceNum && (
                  <div className={styles.priceOriginal}>
                    {formatMoney(listPriceNum)}
                  </div>
                )}
                {/* Displays dynamic price if variant selected, else default */}
                <div className={styles.priceCurrent}>
                  {formatMoney(currentPriceNum)}
                </div>
                <div className={styles.settingPriceNote}>( Setting Price )</div>
                {computedDiscountPct && (
                  <span className={styles.discountBadge}>
                    -{computedDiscountPct}%
                  </span>
                )}
              </div>
              <div className={styles.priceNote}>
                * Discount Coupon Is Applied Automatically
              </div>

              {/* Warn if combo not found */}
              {!currentVariant && !loadingVariants && (
                <div
                  style={{
                    color: "red",
                    fontSize: "13px",
                    marginTop: 5,
                    fontWeight: 600,
                  }}
                >
                  ⚠ Combination Unavailable
                </div>
              )}
            </div>

            <div className={styles.priceActions}>
              <Button
                label={isAddingCart ? "Adding..." : "Add to cart"}
                bgColor="#fff"
                textColor="#A54EA8"
                borderColor="rgba(165,78,168,0.14)"
                width="100%"
                height="48px"
                borderRadius="10px"
                onClick={() => handleAddToCartAction(false)}
                disabled={isAddingCart || !currentVariant}
              />
              <Button
                label="Buy Now"
                bgColor="#A54EA8"
                textColor="#fff"
                width="100%"
                height="48px"
                borderRadius="10px"
                onClick={() => handleAddToCartAction(true)}
                disabled={isAddingCart || !currentVariant}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Info */}
      <div className={styles.accordion}>
        {accordionRows.map((row, idx) => {
          const isOpen = openAcc === idx;
          return (
            <div className={styles.accItem} key={idx}>
              <button
                type="button"
                className={styles.accHeader}
                onClick={() => toggleAcc(idx)}
              >
                <span>{row.title}</span>
                <span className={styles.accToggle}>
                  <span className={styles.accIcon}>{isOpen ? "−" : "+"}</span>
                </span>
              </button>
              <div
                className={`${styles.accBodyWrap} ${
                  isOpen ? styles.accBodyWrapOpen : ""
                }`}
              >
                <div className={styles.accBody}>{row.body}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
