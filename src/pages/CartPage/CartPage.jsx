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

  // Fetch Cart Data
  const loadCart = async () => {
    if (!isLoggedIn()) {
      setLoading(false);
      return;
    }

    try {
      const data = await fetchCart();
      if (data?.cart) {
        setItems(data.cart.items || []);
        setCartMeta({
          subtotal: data.cart.subtotal || 0,
          total: data.cart.total || 0,
          shipping: 100, // hardcoded or derived if api provides
          taxes: 0, // or derived
        });
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

  // Handle Quantity Update
  const handleQtyChange = async (id, newQty) => {
    const oldItems = items;
    setItems((prev) =>
      prev.map((it) => (it._id === id ? { ...it, quantity: newQty } : it))
    );

    try {
      await updateCartItemQty(id, newQty);
      loadCart(); // Reload to get correct totals
    } catch (err) {
      console.error("Qty update failed", err);
      setItems(oldItems);
    }
  };

  // Handle Remove
  const handleRemove = async (id) => {
    const oldItems = items;
    setItems((prev) => prev.filter((it) => it._id !== id));

    try {
      await removeCartItem(id);
      loadCart();
    } catch (err) {
      console.error("Remove failed", err);
      setItems(oldItems);
    }
  };

  // Calculate UI totals
  const { subTotal, shipping, taxes, grandTotal } = useMemo(() => {
    const sub = cartMeta.subtotal;
    const ship = 100;
    const tax = sub * 0.05;
    // Using a calculated total for display, but API total (cartMeta.total) is usually preferred for checkout
    // If API provides 'total', use that. Otherwise calculate.
    const total = cartMeta.total || sub + ship + tax;

    return {
      subTotal: sub,
      shipping: ship,
      taxes: tax,
      grandTotal: total,
    };
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
    <>
      <div className={styles.page}>
        <div className={styles.grid}>
          {/* LEFT: List */}
          <section className={styles.left}>
            <div style={{ display: "grid", gap: 14 }}>
              {items.map((it) => {
                const title =
                  it.itemSnapshot?.title ||
                  it.variant?.productName ||
                  it.product?.productName ||
                  "Product";

                const img =
                  it.itemSnapshot?.images?.[0] ||
                  it.variant?.image ||
                  it.selectedDiamond?.imageUrl ||
                  "/images/rings/gold.jpg";

                return (
                  <CartCard
                    key={it._id}
                    id={it._id}
                    img={img}
                    title={title}
                    price={it.pricePerItem}
                    qty={it.quantity}
                    onQtyChange={(q) => handleQtyChange(it._id, q)}
                    onRemove={() => handleRemove(it._id)}
                  />
                );
              })}
            </div>
          </section>

          {/* RIGHT: Order Summary */}
          <aside className={styles.summary}>
            <h3 className={styles.summaryTitle}>Order Summary</h3>
            <hr className={styles.divider} />

            <div className={styles.row}>
              <span>Subtotal</span>
              <span>${subTotal.toLocaleString("en-US")}</span>
            </div>
            <div className={styles.row}>
              <span>Shipping</span>
              <span>${shipping.toLocaleString("en-US")}</span>
            </div>
            <div className={styles.row}>
              <span>Taxes</span>
              <span>
                ${taxes.toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </span>
            </div>

            <hr className={styles.divider} />

            <div className={styles.row}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalValue}>
                $
                {grandTotal.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className={styles.shipRow}>
              <span role="img" aria-label="truck">
                🚚
              </span>
              <span>Ships by Thursday, 12 Sept</span>
            </div>

            <div className={styles.noteLink}>
              Free overnight shipping and hassle-free returns
            </div>

            <Button
              label="Proceed"
              bgColor="var(--Primary_Color)"
              textColor="var(--White_Color)"
              borderColor="var(--Primary_Color)"
              width="100%"
              height="56px"
              borderRadius="12px"
              fontSize="18px"
              fontWeight="700"
              onClick={handleProceed}
              style={{ marginTop: 16 }}
            />
          </aside>
        </div>
      </div>
    </>
  );
}
