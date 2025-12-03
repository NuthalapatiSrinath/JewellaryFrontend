import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./OrdersPage.module.css";
import CartCard from "../../components/CartCard/CartCard";
import { BsBoxSeam, BsClockHistory } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { fetchOrders } from "../../api/userActionsService";
import { openModal } from "../../redux/slices/modalSlice";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchOrders();
        // API returns { success: true, orders: [...] }
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Failed to load orders", err);
        setError("Could not load order history.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Helper to format date
  const formatDate = (isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  // Helper to get status UI helpers
  const getStatusMeta = (status) => {
    const s = String(status).toLowerCase();
    if (s === "delivered") {
      return {
        icon: <BsBoxSeam />,
        label: "Order Delivered",
        className: styles.delivered,
      };
    } else if (s === "cancelled") {
      return {
        icon: <RxCross2 />,
        label: "Order Cancelled",
        className: styles.cancelled,
      };
    } else {
      // Default for Pending/Processing
      return {
        icon: <BsClockHistory />,
        label: `Order ${status}`,
        className: styles.pending || styles.delivered,
      };
    }
  };

  if (loading)
    return (
      <div className={styles.page}>
        <p>Loading orders...</p>
      </div>
    );
  if (error)
    return (
      <div className={styles.page}>
        <p className={styles.error}>{error}</p>
      </div>
    );

  return (
    <div className={styles.page}>
      <h2 className={styles.pageTitle}>My Orders</h2>

      <div className={styles.list}>
        {orders.length === 0 && <p>No orders found.</p>}

        {orders.map((order) => {
          const { icon, label, className } = getStatusMeta(order.status);

          return (
            <section key={order._id} className={styles.orderCard}>
              <header className={styles.orderHead}>
                <div className={`${styles.statusBadge} ${className}`}>
                  {icon}
                </div>

                <div className={styles.meta}>
                  <div className={styles.statusText}>{label}</div>
                  <div className={styles.dateText}>
                    {formatDate(order.createdAt)}
                  </div>
                  <div className={styles.orderId}>
                    ID: {order.orderId || order._id}
                  </div>
                </div>

                <div className={styles.totalPrice}>
                  Total: ${order.total?.toLocaleString()}
                </div>
              </header>

              <div className={styles.orderBody}>
                {/* An order can have multiple items, map them all */}
                {order.items.map((item) => {
                  // Fallback image logic
                  const fallbackImg = "/images/rings/gold.jpg";
                  const itemImg =
                    item.itemSnapshot?.images?.[0] ||
                    item.variant?.image ||
                    fallbackImg;

                  return (
                    <CartCard
                      key={item._id || item.variantSku}
                      id={item._id} // This ID is for the cart card actions (delete etc, though usually disabled in orders)
                      img={itemImg}
                      title={
                        item.itemSnapshot?.title ||
                        item.variant?.productName ||
                        "Product"
                      }
                      price={item.pricePerItem}
                      qty={item.quantity}
                      // Disable quantity changes in Order History view
                      onQtyChange={() => {}}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
