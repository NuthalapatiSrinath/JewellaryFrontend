import React, { useEffect, useMemo, useState } from "react";
import styles from "./CartPage.module.css";
import CartCard from "../../components/CartCard/CartCard";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import {
  fetchCart,
  updateCartItemQty,
  removeCartItem,
} from "../../api/cartService";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/modalSlice";
import { isLoggedIn } from "../../utils/userAuth";

export default function CartPage({ onNext }) {
  const [items, setItems] = useState([]);
  const [cartMeta, setCartMeta] = useState({ subtotal: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const dispatch = useDispatch();

  const loadCart = async () => {
    if (!isLoggedIn()) {
      setLoading(false);
      return;
    }
    try {
      const data = await fetchCart();
      if (data?.success && data?.cart) {
        setItems(data.cart.items || []);
        setCartMeta({
          subtotal: data.cart.subtotal || 0,
          total: data.cart.total || data.cart.subtotal || 0,
        });
      } else {
        // Fallback if cart is null (empty)
        setItems([]);
      }
    } catch (err) {
      console.error("Failed to load cart", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleQtyChange = async (id, newQty) => {
    const oldItems = [...items];
    setItems((prev) =>
      prev.map((it) => (it._id === id ? { ...it, quantity: newQty } : it))
    );
    try {
      await updateCartItemQty(id, newQty);
      loadCart(); // Reload for server calculations
    } catch (err) {
      console.error("Qty update failed", err);
      setItems(oldItems);
    }
  };

  const handleRemove = async (id) => {
    const oldItems = [...items];
    setItems((prev) => prev.filter((it) => it._id !== id));
    try {
      await removeCartItem(id);
      loadCart();
    } catch (err) {
      console.error("Remove failed", err);
      setItems(oldItems);
    }
  };

  const { subTotal, grandTotal } = useMemo(() => {
    const sub = cartMeta.subtotal;
    const total = cartMeta.total;
    return { subTotal: sub, grandTotal: total };
  }, [cartMeta]);

  const handleProceed = () => {
    if (!isLoggedIn()) {
      dispatch(openModal({ type: "AUTH" }));
    } else {
      if (onNext) onNext();
      else nav("/checkout");
    }
  };

  if (loading) return <div className={styles.loading}>Loading cart...</div>;

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <h2>Your cart is empty</h2>
        <Button label="Start Shopping" onClick={() => nav("/")} width="200px" />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        <section className={styles.left}>
          <div style={{ display: "grid", gap: 14 }}>
            {items.map((it) => {
              // --- Logic to extract Title and Image ---
              let title = "Product";
              let img = "/images/rings/gold.jpg";

              if (it.itemType === "dyo") {
                title = it.product?.productName || "Custom Design Ring";
                img =
                  it.selectedDiamond?.imageUrl || "/images/rings/diamond.png";
              } else {
                title = it.variant?.variantSku || "Ready to Ship Ring";
                if (it.variant?.metalType)
                  title += ` (${it.variant.metalType.replace(/_/g, " ")})`;
                img = it.variant?.image || "/images/rings/gold.jpg";
              }

              return (
                <CartCard
                  key={it._id}
                  id={it._id}
                  img={img}
                  title={title}
                  price={it.totalPrice || it.pricePerItem} // Use total price for DYO usually
                  qty={it.quantity}
                  onQtyChange={(q) => handleQtyChange(it._id, q)}
                  onRemove={() => handleRemove(it._id)}
                />
              );
            })}
          </div>
        </section>

        <aside className={styles.summary}>
          <h3 className={styles.summaryTitle}>Order Summary</h3>
          <hr className={styles.divider} />
          <div className={styles.row}>
            <span>Subtotal</span>
            <span>
              ${subTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <hr className={styles.divider} />
          <div className={styles.row}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalValue}>
              $
              {grandTotal.toLocaleString("en-US", { maximumFractionDigits: 2 })}
            </span>
          </div>
          <Button
            label="Proceed"
            bgColor="var(--Primary_Color)"
            textColor="var(--White_Color)"
            width="100%"
            height="56px"
            borderRadius="12px"
            onClick={handleProceed}
            style={{ marginTop: 16 }}
          />
        </aside>
      </div>
    </div>
  );
}
