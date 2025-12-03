import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PaymentPage.module.css";

/* reuse */
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import FooterSection from "../FooterPage/FooterPage";

/* You may also like (same as Cart/Address) */
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

export default function PaymentPage() {
  const [method, setMethod] = useState("upi");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  // lock scroll while the overlay is visible
  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [loading]);

  const onBookNow = () => {
    // show overlay for ~3 seconds, then go to success page
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      nav("/checkout/success");
    }, 3000);
  };

  return (
    <>
      {/* blocking overlay */}
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
              Redirecting to payment page please don’t cancel
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
              <span className={styles.method}>Credit / debit Cards</span>
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
              <span className={styles.method}>Pay after service to hand</span>
            </label>
          </div>

          {/* RIGHT: summary */}
          <aside className={styles.summary}>
            <h3 className={styles.summaryTitle}>Order Summary</h3>

            <div className={styles.line}>
              <span>Total Items</span>
              <span>01</span>
            </div>
            <div className={styles.line}>
              <span>Total MRP</span>
              <span>Rs. 20000</span>
            </div>
            <div className={styles.line}>
              <span>Coupon Discount</span>
              <span>0</span>
            </div>

            <hr className={styles.hr} />

            <div className={`${styles.line} ${styles.total}`}>
              <span>Total Amount</span>
              <span>Rs. 10,000</span>
            </div>

            <button className={styles.cta} onClick={onBookNow}>
              Book Now
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
                  card: styles.productCard, // no white bg around these tiles
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
