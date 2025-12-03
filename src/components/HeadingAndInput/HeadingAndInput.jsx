import React, { forwardRef } from "react";
import styles from "./HeadingAndInput.module.css";

/**
 * HeadingAndInput
 *
 * Props
 * - label: string (top heading)
 * - name: string (html name/id)
 * - value: string (controlled)  | defaultValue (uncontrolled)
 * - onChange: function(e)
 * - type: "text" | "email" | "tel" | "number" | "password" (ignored for textarea)
 * - placeholder: string
 * - required: bool
 * - disabled: bool
 * - textarea: bool (if true, renders <textarea>)
 * - rows: number (textarea rows, default 3)
 *
 * Style props (all optional, fallback to CSS/tokens)
 * - width, height, radius, bgColor, textColor, borderColor, labelColor, fontSize
 * - leftIcon, rightIcon: React nodes (e.g., <FiUser />)
 * - helperText: string (below input)
 * - error: string (error text, changes border color)
 *
 * Usage:
 *  <HeadingAndInput label="Name" name="name" placeholder="Enter your name" />
 */
const HeadingAndInput = forwardRef(
  (
    {
      label,
      name,
      value,
      defaultValue,
      onChange,
      type = "text",
      placeholder = "",
      required = false,
      disabled = false,
      textarea = false,
      rows = 3,
      leftIcon,
      rightIcon,
      helperText,
      error,

      // style props
      width,
      height,
      radius,
      bgColor,
      textColor,
      borderColor,
      labelColor,
      fontSize,

      // rest
      autoComplete,
      maxLength,
      style,
      ...rest
    },
    ref
  ) => {
    const cssVars = {
      "--hai-width": width || "100%",
      "--hai-height": height || (textarea ? "auto" : "48px"),
      "--hai-radius": radius || "8px",
      "--hai-bg":
        bgColor || "rgba(153, 51, 153, 0.06)" /* ~#FAF5FA using primary tint */,
      "--hai-text": textColor || "var(--Black_Color)",
      "--hai-border": borderColor || "transparent",
      "--hai-label": labelColor || "rgba(0,0,0,0.6)",
      "--hai-font-size": fontSize || "16px",
      "--hai-border-error": "rgba(192,57,43,0.65)",
    };

    const commonProps = {
      name,
      id: name,
      value,
      defaultValue,
      onChange,
      placeholder,
      required,
      disabled,
      autoComplete,
      maxLength,
      ref,
      className: `${styles.field} ${error ? styles.error : ""}`,
      style: cssVars,
      ...rest,
    };

    return (
      <div
        className={styles.wrap}
        style={{ width: cssVars["--hai-width"], ...style }}
      >
        {label && (
          <label
            htmlFor={name}
            className={styles.label}
            style={{ color: cssVars["--hai-label"] }}
          >
            {label}
          </label>
        )}

        <div className={styles.inputShell}>
          {leftIcon && (
            <span className={`${styles.icon} ${styles.left}`}>{leftIcon}</span>
          )}

          {textarea ? (
            <textarea
              rows={rows}
              {...commonProps}
              className={`${styles.field} ${styles.textarea} ${
                error ? styles.error : ""
              }`}
            />
          ) : (
            <input type={type} {...commonProps} />
          )}

          {rightIcon && (
            <span className={`${styles.icon} ${styles.right}`}>
              {rightIcon}
            </span>
          )}
        </div>

        {(helperText || error) && (
          <div
            className={`${styles.helper} ${error ? styles.helperError : ""}`}
          >
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

export default HeadingAndInput;
