import React, { useMemo } from "react";
import "./OrderSummarryCard.css";
import Button from "../../components/Button/Button"; // ✅ your existing reusable button

/**
 * OrderSummaryCard Component
 *
 * Props:
 * - items: [{ id, name, image, price, qty }]
 * - shippingCharges: number
 * - otherCharges: number
 * - deliveryText: string
 * - noteText: string
 * - onProceed: () => void
 */
export default function OrderSummaryCard({
  items = [],
  shippingCharges = 0,
  otherCharges = 0,
  deliveryText = "Ships by Thursday, 12 Sept",
  noteText = "Free Overnight shipping and hassle-free returns",
  onProceed = () => {},
}) {
  // 💵 Format in USD currency
  const formatUSD = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);

  // 🧮 Dynamic calculation
  const { subtotal, total } = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
    const total = subtotal + shippingCharges + otherCharges;
    return { subtotal, total };
  }, [items, shippingCharges, otherCharges]);

  return (
    <aside className="os-card" aria-label="Order Summary">
      <h2 className="os-title">Order Summary</h2>

      {/* 🧾 Product Items */}
      {items.length > 0 && (
        <ul className="os-items">
          {items.map((item, idx) => (
            <li key={item.id} className="os-item">
              <img src={item.image} alt={item.name} className="os-thumb" />
              <div className="os-item-main">
                <div className="os-item-name">{item.name}</div>
                <div className="os-item-price">{formatUSD(item.price)}</div>
              </div>
              <div className="os-qty">{item.qty}</div>
              {idx !== items.length - 1 && <div className="os-item-divider" />}
            </li>
          ))}
        </ul>
      )}

      <div className="os-divider" />

      {/* 💰 Subtotals */}
      <div className="os-row">
        <span className="os-muted">Subtotal</span>
        <span>{formatUSD(subtotal)}</span>
      </div>
      <div className="os-row">
        <span className="os-muted">Int. Shipping charges</span>
        <span>{formatUSD(shippingCharges)}</span>
      </div>
      <div className="os-row">
        <span className="os-muted">Taxes and other charges</span>
        <span>{formatUSD(otherCharges)}</span>
      </div>

      <div className="os-divider" />

      {/* 🧾 Total */}
      <div className="os-total">
        <span>Total</span>
        <strong>{formatUSD(total)}</strong>
      </div>

      {/* 🚚 Delivery Info */}
      <div className="os-delivery">
        <TruckIcon />
        <span className="os-muted">{deliveryText}</span>
      </div>

      {/* 🔗 Note */}
      <button type="button" className="os-note">
        {noteText}
      </button>

      {/* ▶ Proceed */}
      <div className="os-actions">
        <Button label="Proceed" onClick={onProceed} />
      </div>
    </aside>
  );
}

function TruckIcon() {
  return (
    <svg
      className="os-truck"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M3 6h11v7h2.5l2-3H21V9l-3-3h-4V4H3v2zm0 7h11v3H3v-3zm16 0a2 2 0 012 2v1h-2v-1h-2v-2h2zM6 19a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z"
        fill="currentColor"
      />
    </svg>
  );
}
