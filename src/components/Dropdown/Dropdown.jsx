import React, { useState, useEffect } from "react";
import styles from "./Dropdown.module.css";
import { IoChevronDownOutline } from "react-icons/io5";
import clsx from "clsx";

/**
 * Props:
 * - label: string
 * - options: string[] (or array of anything renderable)
 * - bgColor: string (CSS color)
 * - onChange: function(optionOrNull)
 * - className: string
 * - showAllOption: boolean
 * - leftIcon: JSX (optional)  -> renders before the label
 * - extraIcon: JSX (optional) -> renders right after the label (but before chevron)
 * - value: (optional) controlled selected value (string or null)
 *
 * Behavior:
 * - If `value` prop is provided the component becomes controlled for selected option.
 * - If no `value` prop is provided the component manages internal selectedOption state (unchanged).
 */
const Dropdown = ({
  label = "Select",
  options = [],
  bgColor,
  onChange,
  className = "",
  showAllOption = true,
  leftIcon = null,
  extraIcon = null,
  value, // controlled value (optional)
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [uncontrolledSelected, setUncontrolledSelected] = useState(null);

  // If `value` prop exists we treat it as source-of-truth (controlled).
  const selectedOption = value !== undefined ? value : uncontrolledSelected;

  useEffect(() => {
    // Close when clicking outside — basic global listener
    const onDoc = (e) => {
      // If click landed inside any element of this component, ignore.
      // We can't easily access the root ref here (no ref passed) so leave outside-handling
      // to page-level clickOutside logic if you use one. (Keep as-is for simplicity.)
    };
    // keep no-op listener for future extension if needed
    return () => {
      // cleanup if you add a listener
    };
  }, []);

  const handleToggle = () => setIsOpen((v) => !v);

  const emitChange = (opt) => {
    if (onChange) onChange(opt === "" ? null : opt);
  };

  const handleSelectOption = (option) => {
    if (value === undefined) setUncontrolledSelected(option);
    setIsOpen(false);
    emitChange(option);
  };

  const handleSelectAll = () => {
    if (value === undefined) setUncontrolledSelected(null);
    setIsOpen(false);
    emitChange(null);
  };

  const styleVars = { "--custom_color": bgColor };

  return (
    <div
      className={clsx(styles.dropdownContainer, className)}
      style={styleVars}
    >
      <div
        className={styles.Dropdown}
        onClick={handleToggle}
        role="button"
        aria-expanded={isOpen}
      >
        {/* label area: leftIcon + label + extraIcon */}
        <div className={styles.labelRow}>
          {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}

          <span className={styles.labelText}>{selectedOption ?? label}</span>

          {extraIcon && <span className={styles.extraIcon}>{extraIcon}</span>}
        </div>

        {/* right chevron stays at the far right */}
        <IoChevronDownOutline
          size={16}
          className={`${styles.icon} ${isOpen ? styles.iconOpen : ""}`}
          aria-hidden="true"
        />
      </div>

      {isOpen && (
        <ul className={styles.optionsList} role="menu">
          {showAllOption && (
            <li
              className={styles.optionItem}
              onClick={handleSelectAll}
              role="menuitem"
            >
              All {label}
            </li>
          )}
          {options.map((option, index) => (
            <li
              key={index}
              className={styles.optionItem}
              onClick={() => handleSelectOption(option)}
              role="menuitem"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
