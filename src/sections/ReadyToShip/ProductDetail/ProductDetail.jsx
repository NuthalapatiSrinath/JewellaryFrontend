import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "../../../redux/slices/modalSlice";

import ImageGallery360 from "../../../components/ImageGallery360/ImageGallery360";
import ProductCard from "../../../components/ProductCard/ProductCard";
import PillBadge from "../../../components/PillBadge/PillBadge";
import ProductInfoPanel from "../../../components/ProductInfoPanel/ProductInfoPanel";

import styles from "./ProductDetail.module.css";

export default function ProductDetail({ product: propProduct, onBack }) {
  const dispatch = useDispatch();

  // Access global products to show recommendations
  const allProducts = useSelector((state) => state.products.items || []);

  // Local state to handle product swaps (when clicking recommendations)
  const [currentProduct, setCurrentProduct] = useState(propProduct);

  // Sync if parent prop changes
  useEffect(() => {
    if (propProduct) setCurrentProduct(propProduct);
  }, [propProduct]);

  // Ref for scrolling
  const detailRef = useRef(null);

  // Scroll helper
  const scrollElementBelowSteps = (smooth = true) => {
    if (!detailRef.current) return;
    const headerHeight = document.querySelector("header")?.offsetHeight || 0;
    const offset = headerHeight + 100; // Gap
    const top =
      detailRef.current.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
  };

  // Scroll on mount or product change
  useEffect(() => {
    scrollElementBelowSteps(true);
  }, [currentProduct?._id, currentProduct?.id]);

  if (!currentProduct) return null;

  // --- Data Normalization ---
  const productId = currentProduct._id || currentProduct.id;

  // Prepare images for Gallery
  const galleryImages = [
    currentProduct.imageUrl1,
    currentProduct.imageUrl2,
    currentProduct.imageUrl3,
    currentProduct.imageUrl4,
  ].filter(Boolean);

  // Fallback logic
  if (galleryImages.length === 0) {
    // If no images, push a placeholder
    galleryImages.push("/images/rings/gold.jpg");
  }

  // Recommendations: Filter out current product
  const recommendations = allProducts
    .filter((p) => (p._id || p.id) !== productId)
    .slice(0, 4);

  // --- Handlers ---
  const handleOpenViewDetails = () => {
    dispatch(openModal({ type: "VIEW_DETAILS", data: currentProduct }));
  };

  const handleRecoCardClick = (p) => {
    setCurrentProduct(p);
  };

  const handleBack = () => {
    if (onBack) onBack();
  };

  return (
    <div className={styles.page} ref={detailRef}>
      {/* Top Controls */}
      <div className={styles.rowControls}>
        <button onClick={handleBack} className={styles.backLink}>
          ← Back To Gallery
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

      {/* Main Content */}
      <div className={styles.main}>
        {/* Left: Image Grid */}
        <div className={styles.left}>
          <ImageGallery360 images={galleryImages} />
        </div>

        {/* Right: Info Panel */}
        <aside className={styles.right}>
          <ProductInfoPanel
            product={{
              ...currentProduct,
              id: productId,
              // Normalize fields for Panel
              title:
                currentProduct.productName ||
                currentProduct.title ||
                "Engagement Ring",
              price: currentProduct.defaultPrice || currentProduct.price,
              productSku: currentProduct.productSku || currentProduct.sku,
              description: currentProduct.description,
              // Default metal/shape for UI init (will be overridden by variants fetch)
              metals: [{ key: "14R", label: "14K Rose Gold" }],
              shapes: [{ key: "RND", label: "Round" }],
            }}
          />
        </aside>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <section className={styles.recommend}>
          <PillBadge text="You May Like" highlightChars={6} />
          <div className={styles.recoGrid}>
            {recommendations.map((p) => (
              <ProductCard
                key={p._id || p.id}
                product={{
                  ...p,
                  title: p.productName || p.title,
                  price: p.defaultPrice || p.price,
                  image: p.imageUrl1 || p.image,
                }}
                onCardClick={() => handleRecoCardClick(p)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
