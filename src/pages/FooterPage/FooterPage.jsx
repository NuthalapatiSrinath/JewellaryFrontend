import React from "react";
import styles from "./FooterPage.module.css";

const FooterPage = () => {
  return (
    <footer className={styles.footerWrap}>
      {/* the white bar above the footer (as in figma) */}
      <div className={styles.topWhiteBar} />

      {/* main footer panel */}
      <div className={styles.footer}>
        {/* centered circular logo overlapping top edge */}
        <div className={styles.logoWrap}>
          <img src="/logo.png" alt="ARRA Logo" className={styles.logo} />
        </div>

        <h2 className={styles.brand}>ARRA JEWELS</h2>

        {/* thin divider under brand */}
        <div className={styles.topDivider} />

        <div className={styles.columns}>
          <div className={styles.column}>
            <h4>About</h4>
            <p>Who we are</p>
            <p>Our mission</p>
            <p>Review</p>
            <p>Press</p>
          </div>

          <div className={styles.column2}>
            <h4>Learn</h4>
            <p>4C’s of diamond</p>
            <p>Crown Diamond Guide</p>
            <p>Grown Gemstone Guide</p>
            <p>Find your ring size</p>
            <p>Guide</p>
          </div>

          <div className={styles.column}>
            <h4>Care</h4>
            <p>Returns</p>
            <p>Shipping</p>
            <p>Lifetime guarantee</p>
            <p>Ring resizing</p>
            <p>FAQ’s</p>
            <p>Accessibility</p>
          </div>

          <div className={styles.column}>
            <h4>Category</h4>
            <p>Engagement Rings</p>
            <p>Wedding Rings</p>
            <p>Earrings</p>
            <p>Bracelett</p>
            <p>Pendants</p>
          </div>

          <div className={styles.column}>
            <h4>Connect</h4>
            <p>Live chat</p>
            <p>contact@arrajewelsusa.com</p>
            <p>+1-224-806-6786</p>
            <p>Shop place</p>
          </div>

          <div className={styles.column}>
            <h4>Socials</h4>
            <p>Instagram</p>
            <p>Facebook</p>
            <p>Twitter</p>
            <p>Whatsapp</p>
          </div>
        </div>

        {/* divider and copyright */}
        <div className={styles.bottomDivider} />
        <div className={styles.copyRight}>Copy Rights 2025@ All Rights Reserved</div>
      </div>
    </footer>
  );
};

export default FooterPage;
