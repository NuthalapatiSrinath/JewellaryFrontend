import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Added useSelector
import styles from "./WishlistPage.module.css";
import ProductCard from "../../components/ProductCard/ProductCard";
import wishlistService from "../../api/wishlistService";
import { isLoggedIn } from "../../utils/userAuth";
import { openModal } from "../../redux/slices/modalSlice";
import {
  fetchWishlist,
  removeItem as removeReduxItem,
} from "../../redux/slices/wishlistSlice"; // Import actions
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function WishlistPage() {
  // USE REDUX STATE INSTEAD OF LOCAL STATE
  // This ensures this page and Topbar are always in sync
  const { items, loading: reduxLoading } = useSelector(
    (state) => state.wishlist
  );

  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    async function load() {
      setError("");
      if (!isLoggedIn()) {
        dispatch(openModal({ type: "AUTH", modalData: { mode: "login" } }));
        return;
      }
      // Trigger Redux fetch
      dispatch(fetchWishlist());
    }

    load();
    // (Optional: You can keep the auth listener if you want auto-reload on login)
  }, [dispatch]);

  const removeItem = async (wishlistId) => {
    if (!wishlistId) return;

    setBusyId(wishlistId);

    try {
      // 1. INSTANTLY update Redux (updates Topbar + this list)
      dispatch(removeReduxItem(wishlistId));

      // 2. Call API in background
      await wishlistService.deleteWishlistItem(wishlistId);

      toast.success("Removed from wishlist.");

      // 3. Optional: Re-fetch to be 100% sure of sync (but UI is already updated)
      dispatch(fetchWishlist());
    } catch (err) {
      console.error("[WishlistPage] delete failed:", err);
      toast.error("Could not delete item.");
      // On error, re-fetch to restore the item
      dispatch(fetchWishlist());
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleWishlist = (wishlistId, currentlyLiked) => {
    if (!currentlyLiked) return;
    removeItem(wishlistId);
  };

  const openProduct = (item) => {
    if (item.__type === "diamond") {
      navigate(`/diamonds/${item.id}`);
    } else {
      navigate(`/products/detail/${item.id}`);
    }
  };

  const EmptyState = (
    <div className={styles.empty}>
      {isLoggedIn() ? "Your wishlist is empty." : "Please sign in."}
    </div>
  );

  // Use reduxLoading for initial load only if items are empty
  const isLoading = reduxLoading && items.length === 0;

  return (
    <div className={styles.page}>
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />

      <div className={styles.headerRow}>
        <h1 className={styles.title}>Wish List</h1>
        <span className={styles.sep}>&raquo;</span>
        <span className={styles.count}>{items.length} items</span>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.grid}>
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}

        {!isLoading && items.length === 0 && EmptyState}

        {!isLoading &&
          items.map((p) => (
            <div key={p.wishlistId} className={styles.cardWrapper}>
              <ProductCard
                product={p}
                onCardClick={() => openProduct(p)}
                isLiked={true}
                busy={busyId === p.wishlistId}
                onLikeToggle={() => handleToggleWishlist(p.wishlistId, true)}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
