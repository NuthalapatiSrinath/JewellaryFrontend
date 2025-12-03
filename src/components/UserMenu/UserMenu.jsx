// src/components/UserMenu/UserMenu.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "../../redux/slices/modalSlice";
import { logout } from "../../redux/slices/authSlice";
import styles from "./UserMenu.module.css";
import { FaUser, FaRegUser } from "react-icons/fa";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const ref = useRef(null);
  const nav = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth || {});

  const name =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    (user?.email ? user.email.split("@")[0] : "User");

  // Close menu when clicking outside
  useEffect(() => {
    const outside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    // Use click instead of mousedown for better mobile support
    document.addEventListener("click", outside);
    return () => document.removeEventListener("click", outside);
  }, []);

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevents the document listener from firing immediately
    setOpen((prev) => !prev);
  };

  const openAuth = (mode = "login") => {
    setOpen(false);
    dispatch(openModal({ type: "AUTH", modalData: { mode } }));
  };

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
    nav("/");
  };

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        className={styles.iconBtn}
        title="Account"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggleMenu}
      >
        {/* Use RegUser for outline style to match Heart/Bag, or FaUser for filled */}
        <FaRegUser size={19} />
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          {!isAuthenticated ? (
            // --- GUEST VIEW ---
            <>
              <button
                className={styles.item}
                onClick={() => openAuth("login")}
                role="menuitem"
              >
                Sign In
              </button>
              <button
                className={styles.item}
                onClick={() => openAuth("signup")}
                role="menuitem"
              >
                Create Account
              </button>
              <button
                className={styles.item}
                onClick={() => openAuth("forgot")}
                role="menuitem"
              >
                Forgot Password?
              </button>
            </>
          ) : (
            // --- LOGGED IN VIEW ---
            <>
              <div className={styles.header}>Hello, {name}</div>
              <Link
                to="/profile"
                className={styles.item}
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                My Profile
              </Link>
              <Link
                to="/orders"
                className={styles.item}
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                My Orders
              </Link>
              <Link
                to="/wishlist"
                className={styles.item}
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                My Wishlist
              </Link>
              <div style={{ height: 1, background: "#eee", margin: "4px 0" }} />
              <button
                className={`${styles.item} ${styles.danger}`}
                role="menuitem"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
