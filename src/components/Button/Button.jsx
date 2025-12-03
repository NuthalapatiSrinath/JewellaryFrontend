import React from "react";
import styles from "./Button.module.css";
import PropTypes from "prop-types";

/**
 * Dynamic Button Component
 *
 * Props:
 * - label: string (button text)
 * - bgColor: string (CSS color or var name)
 * - textColor: string
 * - borderColor: string
 * - width: string (e.g., "180px" or "100%")
 * - height: string (e.g., "44px")
 * - borderRadius: string (e.g., "8px")
 * - iconLeft: React element (optional)
 * - iconRight: React element (optional)
 * - hoverBg: string (optional)
 * - hoverColor: string (optional)
 * - onClick: function
 * - fontSize: string
 * - fontWeight: string
 */

const Button = ({
  label,
  bgColor = "var(--Primary_Color)",
  textColor = "var(--White_Color)",
  borderColor = "transparent",
  width = "auto",
  height = "44px",
  borderRadius = "8px",
  fontSize = "16px",
  fontWeight = "500",
  iconLeft = null,
  iconRight = null,
  hoverBg = null,
  hoverColor = null,
  onClick,
  padding = "0 20px",
  style = {},
}) => {
  return (
    <button
      className={styles.button}
      style={{
        background: bgColor,
        color: textColor,
        border: `1px solid ${borderColor}`,
        width,
        height,
        borderRadius,
        fontSize,
        fontWeight,
        padding,
        "--hover-bg": hoverBg || bgColor,
        "--hover-color": hoverColor || textColor,
        ...style,
      }}
      onClick={onClick}
    >
      {iconLeft && (
        <span className={`${styles.icon} ${styles.left}`}>{iconLeft}</span>
      )}
      <span className={styles.label}>{label}</span>
      {iconRight && (
        <span className={`${styles.icon} ${styles.right}`}>{iconRight}</span>
      )}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  borderColor: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  borderRadius: PropTypes.string,
  fontSize: PropTypes.string,
  fontWeight: PropTypes.string,
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
  hoverBg: PropTypes.string,
  hoverColor: PropTypes.string,
  onClick: PropTypes.func,
  padding: PropTypes.string,
  style: PropTypes.object,
};

export default Button;
