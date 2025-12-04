import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PaymentPage.module.css";

// API Services
import { fetchCart, clearCart } from "../../api/cartService";
import { placeOrderRTS, placeOrderDYO } from "../../api/orderService";

// Components
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import FooterSection from "../FooterPage/FooterPage";

// Recommended items data (kept as requested)
const RECOMMENDED = [
  { title: "Bouncy", img: "/images/reco/bouncy.jpg", slug: "bouncy" },
  { title: "Ball pool", img: "/images/reco/ball-pool.jpg", slug: "ball-pool" },
  {
    title: "Bubble Show",
    img: "/images/reco/bubble-show.png",
    slug: "bubble-show",
  },
  {
    title: "Balloon shooting",
    img: "/images/reco/balloon-shooting.jpg",
    slug: "balloon-shooting",
  },
];

// Helper to convert full metal names to codes
const getMetalCode = (metalStr) => {
  if (!metalStr) return "14R";
  const lower = metalStr.toLowerCase();
  if (lower.includes("rose")) return "14R";
  if (lower.includes("yellow")) return "14Y";
  if (lower.includes("white")) return "14W";
  if (lower.includes("platinum")) return "PT";
  return "14R";
};

export default function PaymentPage({ shippingAddressId }) {
  const [method, setMethod] = useState("upi"); // upi | card | cod
  const [loading, setLoading] = useState(false);

  // Cart Data State
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  const nav = useNavigate();

  // 1. Fetch Cart Data on Mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await fetchCart();
        if (data?.cart) {
          setCartItems(data.cart.items || []);
          setCartTotal(data.cart.total || data.cart.subtotal || 0);
        }
      } catch (error) {
        console.error("Failed to load cart for payment", error);
      }
    };
    loadCart();
  }, []);

  // Lock scroll while loading
  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [loading]);

  // 2. Handle Order Placement
  const onBookNow = async () => {
    if (!shippingAddressId) {
      alert(
        "No shipping address selected. Please go back to the previous step."
      );
      return;
    }

    setLoading(true);

    try {
      let paymentMethodString = "Credit Card";
      if (method === "upi") paymentMethodString = "UPI";
      if (method === "cod") paymentMethodString = "Cash on Delivery";

      // Loop through cart items and place individual orders
      const orderPromises = cartItems.map((item) => {
        const commonPayload = {
          quantity: item.quantity,
          contactEmail: "user@example.com",
          shippingAddressId: shippingAddressId,
          paymentMethod: paymentMethodString,
          discount: 0,
        };

        if (item.itemType === "dyo") {
          // --- Design Your Own ---
          return placeOrderDYO({
            ...commonPayload,
            productSku: item.productSku,
            metal: item.selectedMetal || "18W",
            shapeCode: item.selectedShape || "RND",
            diamondId:
              item.selectedDiamond?._id ||
              item.selectedDiamond?.sku ||
              item.diamondId,
          });
        } else {
          // --- Ready To Ship ---
          return placeOrderRTS({
            ...commonPayload,
            productSku:
              item.variant?.productSku || item.productSku || "RING-001",
            metalCode: getMetalCode(item.variant?.metalType),
            shapeCode: item.variant?.shape_code || "RND",
            centerStoneWeight: item.variant?.centerStoneWeight || 1.0,
          });
        }
      });

      // Wait for all orders to be placed
      const results = await Promise.all(orderPromises);

      // Get the last order result to pass to the success page
      const lastOrderData = results[results.length - 1];

      // Success: Clear cart and redirect
      await clearCart();

      setTimeout(() => {
        setLoading(false);
        // Pass order data to success page
        nav("/checkout/success", { state: { orderData: lastOrderData } });
      }, 1500);
    } catch (error) {
      console.error("Order placement failed", error);
      let msg = "Failed to place your order.";
      if (error.response?.data?.message)
        msg += ` ${error.response.data.message}`;
      alert(msg);
      setLoading(false);
    }
  };

  return (
    <>
      {/* Blocking Overlay */}
      {loading && (
        <div
          className={styles.blocker}
          role="alertdialog"
          aria-live="assertive"
        >
          <div className={styles.blockerCard}>
            <div className={styles.spinnerWrap}>
              <div className={styles.spinnerRing}>
                <div className={styles.spinnerArrow} />
              </div>
            </div>
            <p className={styles.blockerText}>
              Processing your payment, please do not close...
            </p>
          </div>
        </div>
      )}

      <div className={styles.wrap}>
        <div className={styles.grid}>
          {/* LEFT: methods */}
          <div className={styles.card}>
            <h3 className={styles.title}>Choose payment method</h3>

            {/* UPI */}
            <label className={styles.row}>
              <input
                type="radio"
                name="pay"
                checked={method === "upi"}
                onChange={() => setMethod("upi")}
                className={styles.radio}
              />
              <span className={styles.method}>UPI</span>
            </label>

            {method === "upi" && (
              <div className={styles.upiBox}>
                <input className={styles.inp} placeholder="Enter UPI ID" />
                <button className={styles.verify}>Verify</button>
              </div>
            )}

            {/* Card */}
            <label className={styles.row}>
              <input
                type="radio"
                name="pay"
                checked={method === "card"}
                onChange={() => setMethod("card")}
                className={styles.radio}
              />
              <span className={styles.method}>Credit / Debit Cards</span>
            </label>

            {method === "card" && (
              <div className={styles.cardBox}>
                <input
                  className={styles.inp}
                  placeholder="Card number"
                  inputMode="numeric"
                />
                <input className={styles.inp} placeholder="Name on card" />
                <div className={styles.row2}>
                  <input className={styles.inp} placeholder="MM/YY" />
                  <input
                    className={styles.inp}
                    placeholder="CVV"
                    inputMode="numeric"
                  />
                </div>
                <button className={styles.verify}>Save Card</button>
              </div>
            )}

            {/* Pay later */}
            <label className={styles.row}>
              <input
                type="radio"
                name="pay"
                checked={method === "cod"}
                onChange={() => setMethod("cod")}
                className={styles.radio}
              />
              <span className={styles.method}>Pay on Delivery (COD)</span>
            </label>
          </div>

          {/* RIGHT: summary */}
          <aside className={styles.summary}>
            <h3 className={styles.summaryTitle}>Order Summary</h3>

            <div className={styles.line}>
              <span>Total Items</span>
              <span>{cartItems.length}</span>
            </div>

            <div className={styles.line}>
              <span>Shipping</span>
              <span style={{ color: "green" }}>Free</span>
            </div>

            <hr className={styles.hr} />

            <div className={`${styles.line} ${styles.total}`}>
              <span>Total Amount</span>
              <span>Rs. {cartTotal.toLocaleString()}</span>
            </div>

            <button
              className={styles.cta}
              onClick={onBookNow}
              disabled={loading || cartItems.length === 0}
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </aside>
        </div>

        {/* You may also like */}
        {/* <section className={styles.recoSection}>
          <h3 className={styles.recoTitle}>You May also like</h3>
          <div className={styles.recoGrid}>
            {RECOMMENDED.map((c) => (
              <CategoryCard
                key={c.slug}
                title={c.title}
                img={c.img}
                to={`/event/categories/${c.slug}`}
                classes={{
                  ...styles,
                  card: styles.productCard,
                }}
              />
            ))}
          </div>
        </section> */}
      </div>

      {/* <FooterSection /> */}
    </>
  );
}
