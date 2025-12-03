import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PaymentSuccess.module.css";

import CategoryCard from "../../components/CategoryCard/CategoryCard";
import FooterSection from "../../pages/FooterPage/FooterPage";

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

export default function PaymentSuccess() {
  const nav = useNavigate();

  return (
    <>
      <div className={styles.wrap}>
        <div className={styles.successCard}>
          <div className={styles.headRow}>
            <div className={styles.tick}>✓</div>
            <h2 className={styles.title}>PAYMENT SUCESSFUL</h2>
          </div>

          <p className={styles.lead}>
            Thank you for the payment&nbsp;— the order of service and the
            payment is received
          </p>

          <div className={styles.orderId}>ORDER ID: TXN674885773</div>

          <h3 className={styles.blockTitle}>PAYMENT DETAILS</h3>

          <div className={styles.detailBox}>
            <div className={styles.detailRow}>
              <span>Payment done on</span>
              <span>11:22 am , 24/11/2024</span>
            </div>
            <div className={styles.detailRow}>
              <span>Service Date &amp; Time</span>
              <span>11:00 am , 30/11/2024</span>
            </div>
          </div>

          <div className={styles.btnRow}>
            <button className={styles.primaryBtn}>Download&nbsp;Invoice</button>
            <button className={styles.ghostBtn} onClick={() => nav("/")}>
              Go Home
            </button>
          </div>
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

      <FooterSection />
    </>
  );
}
