import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ProductCard.module.css";
import wishlistService from "../../api/wishlistService";
import { fetchWishlist } from "../../redux/slices/wishlistSlice";
import { openModal } from "../../redux/slices/modalSlice";
import { isLoggedIn } from "../../utils/userAuth";

export default function ProductCard({
  product,
  onCardClick,
  isLiked: controlledIsLiked,
  onLikeToggle,
  busy: parentBusy = false,
}) {
  const dispatch = useDispatch();
  const [color, setColor] = useState(product.defaultColor || "gold");
  const [localBusy, setLocalBusy] = useState(false);

  // 1. Get Global Wishlist State from Redux
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);

  // 2. Stable ID for comparison
  const stableProductId = product.id || product._id || product.productId;

  // 3. Check if this product exists in the wishlist
  const foundInWishlist = wishlistItems.find(
    (item) =>
      String(item.id) === String(stableProductId) ||
      String(item.productId) === String(stableProductId)
  );

  const isWishlisted =
    typeof controlledIsLiked !== "undefined"
      ? controlledIsLiked
      : !!foundInWishlist;

  const effectiveBusy = parentBusy || localBusy;

  // 4. Handle Heart Click
  const handleWishlist = async (e) => {
    e.stopPropagation();

    if (typeof onLikeToggle === "function") {
      onLikeToggle();
      return;
    }

    if (!isLoggedIn()) {
      dispatch(openModal({ type: "AUTH", modalData: { mode: "login" } }));
      return;
    }

    setLocalBusy(true);
    try {
      if (isWishlisted) {
        // REMOVE logic
        const idToRemove = product.wishlistId || foundInWishlist?.wishlistId;
        if (idToRemove) {
          await wishlistService.deleteWishlistItem(idToRemove);
        } else {
          console.warn("Cannot remove: Missing wishlistId");
        }
      } else {
        // ADD logic (FIXED PAYLOAD)
        const payload = stableProductId
          ? { productId: stableProductId, itemType: "product" }
          : { productSku: product.productSku, itemType: "product" };

        await wishlistService.addProductToWishlist(payload);
      }

      // 5. Update Redux - This triggers Topbar count update & turns heart red
      await dispatch(fetchWishlist());
    } catch (err) {
      console.error("Wishlist action failed", err);
    } finally {
      setLocalBusy(false);
    }
  };

  const currentImage = product?.variants?.[color] || null;
  const hoverImage = product?.variantsHover?.[color] ?? product?.hover ?? null;
  const metalLabel = color === "white" ? "Diamond" : "Gold";

  const handleCardActivate = () => {
    if (typeof onCardClick === "function") onCardClick(product);
  };

  return (
    <article className={styles.card} aria-label={product.title}>
      <div className={styles.imageWrap}>
        {currentImage && (
          <div onClick={handleCardActivate} style={{ cursor: "pointer" }}>
            <img
              src={currentImage}
              alt={product.title}
              className={styles.image}
              loading="lazy"
            />
            {hoverImage && (
              <img
                src={hoverImage}
                alt={product.title}
                className={styles.imageHover}
                loading="lazy"
              />
            )}
          </div>
        )}

        <button
          type="button"
          className={`${styles.heart} ${
            isWishlisted ? styles.heartActive : ""
          }`}
          onClick={handleWishlist}
          disabled={effectiveBusy}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={styles.heartIcon}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>

      <div className={styles.body}>
        <div className={styles.swatchRow} onClick={(e) => e.stopPropagation()}>
          {["gold", "white", "rose"].map((c) => {
            const dot =
              c === "gold" ? "#b4c133" : c === "white" ? "#e7e7e7" : "#edd9d9";
            return (
              <button
                key={c}
                type="button"
                className={`${styles.swatch} ${
                  color === c ? styles.swatchActive : ""
                }`}
                style={{ backgroundColor: dot }}
                onClick={() => setColor(c)}
              />
            );
          })}
          <span className={styles.metalText}>{metalLabel}</span>
        </div>

        <h3 className={styles.title} onClick={handleCardActivate}>
          {product.title}
        </h3>
        <p className={styles.subtitle}>{product.subtitle}</p>
        <div className={styles.price}>{product.price}</div>
      </div>
    </article>
  );
}
