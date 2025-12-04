import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./PaymentSuccess.module.css";

// Components
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import FooterSection from "../FooterPage/FooterPage";

// Same recommended cards
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
  const location = useLocation();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // 1. Get real order data passed from PaymentPage
    if (location.state?.orderData?.order) {
      setOrder(location.state.orderData.order);
    }
  }, [location.state]);

  // Function to generate detailed Invoice and Print/Save as PDF
  const handleDownloadInvoice = () => {
    if (!order) return;

    const invoiceHTML = `
      <html>
        <head>
          <title>Invoice - ${order.orderId}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #d4af37; }
            .details { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; background: #f9f9f9; padding: 10px; border-bottom: 1px solid #ddd; }
            td { padding: 10px; border-bottom: 1px solid #eee; }
            .total-row { font-weight: bold; font-size: 1.1em; }
            .footer { margin-top: 50px; font-size: 12px; text-align: center; color: #999; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">ARRA JEWELS</div>
            <div style="text-align:right;">
              <h2 style="margin:0;">INVOICE</h2>
              <p>ID: ${order.orderId}<br>Date: ${new Date(
      order.createdAt
    ).toLocaleDateString()}</p>
            </div>
          </div>

          <div class="details">
            <h3>Bill To:</h3>
            <p>
              ${order.shippingAddress?.firstName} ${
      order.shippingAddress?.lastName
    }<br>
              ${order.shippingAddress?.address}, ${
      order.shippingAddress?.city
    }<br>
              ${order.shippingAddress?.state} - ${
      order.shippingAddress?.postalCode
    }<br>
              ${order.shippingAddress?.country}<br>
              Phone: ${order.shippingAddress?.phone}
            </p>
          </div>

          <table>
            <thead>
              <tr><th>Item</th><th>Qty</th><th style="text-align:right;">Price</th></tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td>
                    ${item.variant?.productSku || "Jewellery Item"}<br>
                    <small>${item.variant?.metalType || ""} ${
                    item.variant?.shape_code || ""
                  }</small>
                  </td>
                  <td>${item.quantity}</td>
                  <td style="text-align:right;">$${item.pricePerItem.toLocaleString()}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div style="text-align:right; margin-top: 20px;">
            <p>Subtotal: $${order.subtotal.toLocaleString()}</p>
            <p>Shipping: $${order.shippingCost.toLocaleString()}</p>
            <p>Tax: $${(order.taxes || 0).toLocaleString()}</p>
            <p class="total-row">Total: $${order.total.toLocaleString()}</p>
          </div>

          <div class="footer">
            <p>Thank you for shopping with Arra Jewels!</p>
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;

    // Open in new tab and trigger print
    const newWindow = window.open("", "_blank");
    newWindow.document.write(invoiceHTML);
    newWindow.document.close();
  };

  // Safe accessors for display
  const orderId = order?.orderId || "Pending...";
  const orderDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleString()
    : new Date().toLocaleString();
  const totalAmount = order?.total?.toLocaleString() || "0.00";

  return (
    <>
      <div className={styles.wrap}>
        <div className={styles.successCard}>
          <div className={styles.headRow}>
            <div className={styles.tick}>✓</div>
            <h2 className={styles.title}>PAYMENT SUCCESSFUL</h2>
          </div>

          <p className={styles.lead}>
            Thank you for the payment — your order has been received!
          </p>

          <div className={styles.orderId}>ORDER ID: {orderId}</div>

          <h3 className={styles.blockTitle}>PAYMENT DETAILS</h3>

          <div className={styles.detailBox}>
            <div className={styles.detailRow}>
              <span>Payment Date</span>
              <span>{orderDate}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Total Amount</span>
              <span style={{ fontWeight: "bold" }}>${totalAmount}</span>
            </div>
          </div>

          <div className={styles.btnRow}>
            <button
              className={styles.primaryBtn}
              onClick={handleDownloadInvoice}
              disabled={!order}
            >
              Download Invoice (PDF)
            </button>
            <button className={styles.ghostBtn} onClick={() => nav("/orders")}>
              Go to Orders
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
