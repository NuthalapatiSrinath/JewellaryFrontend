import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import PillBadge from "../../components/PillBadge/PillBadge";
import styles from "./FeaturedCollectionSection.module.css";

export default function FeaturedCollectionSection({ products = [] }) {
  const scrollerRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const navigate = useNavigate();

  const handleOpen360 = (product) => {
    console.log(`Open 360° view for: ${product.title}`);
  };

  const updateEnds = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 2);
    setCanNext(el.scrollLeft < max - 2);
  }, []);

  useEffect(() => {
    updateEnds();
    const onResize = () => updateEnds();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [updateEnds, products.length]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateEnds, { passive: true });
    return () => el.removeEventListener("scroll", updateEnds);
  }, [updateEnds]);

  const getStep = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return 0;
    const item = el.querySelector("[data-card]");
    const gap = parseFloat(
      getComputedStyle(el).getPropertyValue("--fc-gap") || "24"
    );
    const w = item ? item.getBoundingClientRect().width : el.clientWidth * 0.8;
    return Math.round(w + gap);
  }, []);

  const scrollBy = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir === "next" ? getStep() : -getStep(),
      behavior: "smooth",
    });
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollBy("next");
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollBy("prev");
    }
  };

  // Navigate to collection product page and pass product in state
  const openCollectionProduct = (product) => {
    if (!product) return;
    navigate("/collection-product", {
      state: { product },
      replace: false,
    });
  };

  return (
    <section className={styles.section} aria-labelledby="fc-title">
      <div className={styles.header}>
        <PillBadge
          text="Featured Collection"
          highlightChars={9}
          verticalShrink={1}
        />

        <div className={styles.controls}>
          <button
            type="button"
            className={`${styles.nav} ${styles.left}`}
            onClick={() => scrollBy("prev")}
            disabled={!canPrev}
            aria-label="Previous products"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            className={`${styles.nav} ${styles.right}`}
            onClick={() => scrollBy("next")}
            disabled={!canNext}
            aria-label="Next products"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.viewport}>
        <div
          className={styles.scroller}
          ref={scrollerRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          role="list"
          aria-label="Featured products"
        >
          {products.map((p) => (
            <div key={p.id} data-card className={styles.item} role="listitem">
              <ProductCard
                product={p}
                onOpen360={handleOpen360}
                // clicking card navigates into collection product page and passes product
                onCardClick={() => openCollectionProduct(p)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
