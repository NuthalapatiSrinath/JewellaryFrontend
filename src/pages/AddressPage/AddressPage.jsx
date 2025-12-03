import React, { useEffect, useState } from "react";
import styles from "./AddressPage.module.css";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/modalSlice";
import { useNavigate } from "react-router-dom";

import CategoryCard from "../../components/CategoryCard/CategoryCard";
import FooterSection from "../FooterPage/FooterPage";

// Same recommended cards as Cart
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

export default function AddressPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("staticLoggedIn")
  );

  useEffect(() => {
    const onAuth = () => {
      localStorage.setItem("staticLoggedIn", "1");
      setIsLoggedIn(true);
    };
    window.addEventListener("auth:success", onAuth);
    return () => window.removeEventListener("auth:success", onAuth);
  }, []);

  const handleCTA = () => {
    if (isLoggedIn) navigate("/payment");
    else dispatch(openModal({ type: "AUTH" }));
  };

  return (
    <>
      <div className={styles.wrap}>
        <div className={styles.grid}>
          {/* LEFT: form */}
          <div className={styles.card}>
            <h3 className={styles.title}>Contact details</h3>
            <input className={styles.inp} placeholder="Name *" />
            <input className={styles.inp} placeholder="Mobile Number *" />

            <h3 className={styles.title}>Address details</h3>
            <div className={styles.row2}>
              <input className={styles.inp} placeholder="Date *" />
              <input className={styles.inp} placeholder="Time *" />
            </div>
            <input className={styles.inp} placeholder="Pin code *" />
            <textarea
              className={`${styles.inp} ${styles.textarea}`}
              rows={4}
              placeholder="Enter Address *"
            />

            <div className={styles.actions}>
              <button className={styles.reset}>Reset</button>
              <button
                className={styles.save}
                onClick={() => dispatch(openModal({ type: "AUTH" }))}
              >
                Save
              </button>
            </div>
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

            <button className={styles.cta} onClick={handleCTA}>
              {isLoggedIn ? "Go to Payment" : "Log in to Proceed"}
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
                  card: styles.productCard, // 👈 override .card for these
                }}
              />
            ))}
          </div>
        </section> */}
      </div>

      {/* Footer */}
      {/* <FooterSection /> */}
    </>
  );
}
