import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, register } from "../../redux/slices/authSlice";
import { forgotPassword } from "../../api/userAuthService";
import styles from "./AuthModal.module.css";
import HeadingAndInput from "../../components/HeadingAndInput/HeadingAndInput";
import Button from "../../components/Button/Button";

export default function AuthModal({ open, onClose, data }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Safely access auth state
  const { loading, error: reduxError } = useSelector(
    (state) => state.auth || { loading: false, error: null }
  );

  const [mode, setMode] = React.useState("login");
  const [first, setFirst] = React.useState("");
  const [last, setLast] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [localError, setLocalError] = React.useState("");
  const [info, setInfo] = React.useState("");

  const firstRef = React.useRef(null);
  const emailRef = React.useRef(null);

  const normalizeMode = React.useCallback((m) => {
    const v = String(m || "").toLowerCase();
    if (v.includes("sign") || v.includes("reg") || v.includes("up"))
      return "signup";
    if (v.startsWith("forg")) return "forgot";
    return "login";
  }, []);

  React.useEffect(() => {
    setMode((prev) => normalizeMode(data?.mode ?? prev));
  }, [data?.mode, normalizeMode]);

  // Focus management
  React.useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      if (mode === "signup") firstRef.current?.focus();
      else emailRef.current?.focus();
    });
  }, [mode, open]);

  // Escape key handler
  React.useEffect(() => {
    if (!open) return;
    const esc = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, onClose]);

  if (!open) return null;

  const toast = (msg) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("toast:show", { detail: { message: msg } })
      );
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setLocalError("");
    setInfo("");
  };

  // --- Handlers ---

  const onLogin = async (e) => {
    e?.preventDefault?.();
    setLocalError("");

    if (!email.trim() || !pass.trim()) {
      return setLocalError("Please enter Email and Password.");
    }

    try {
      // Login and wait for success
      await dispatch(login({ email, password: pass })).unwrap();

      toast("Logged in successfully.");

      // Simply close the modal (no redirect)
      onClose?.();
    } catch (err) {
      console.error("Login failed:", err);
      setLocalError(typeof err === "string" ? err : "Login failed.");
    }
  };

  const onSignup = async (e) => {
    e?.preventDefault?.();
    setLocalError("");

    if (!first.trim() || !last.trim() || !email.trim() || !pass.trim()) {
      return setLocalError("Please enter all required fields.");
    }

    try {
      const payload = {
        firstName: first,
        lastName: last,
        email,
        password: pass,
      };

      // 1. Register
      await dispatch(register(payload)).unwrap();

      // 2. Auto-Login immediately so UserMenu updates
      await dispatch(login({ email, password: pass })).unwrap();

      toast("Account created! You are logged in.");

      // 3. Close Modal (stay on page)
      onClose?.();
    } catch (err) {
      console.error("Signup failed:", err);
      setLocalError(typeof err === "string" ? err : "Registration failed.");
    }
  };

  const onForgot = async (e) => {
    e?.preventDefault?.();
    setLocalError("");
    if (!email.trim()) return setLocalError("Please enter your Email.");

    try {
      const res = await forgotPassword(email.trim());
      setInfo(res?.message || "Reset link sent.");
      toast("Reset link sent.");
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Request failed";
      setLocalError(msg);
    }
  };

  // --- Views ---

  const displayError = localError || reduxError;
  const ErrorBlock = displayError ? (
    <div className={styles.error}>{displayError}</div>
  ) : null;

  const HeaderTabs = (
    <div className={styles.tabs}>
      <button
        type="button"
        className={`${styles.tab} ${mode === "signup" ? styles.active : ""}`}
        onClick={() => switchMode("signup")}
      >
        SIGN UP
      </button>
      <button
        type="button"
        className={`${styles.tab} ${mode === "login" ? styles.active : ""}`}
        onClick={() => switchMode("login")}
      >
        LOG IN
      </button>
    </div>
  );

  const LoginView = (
    <form className={styles.card} onSubmit={onLogin}>
      {HeaderTabs}
      <HeadingAndInput
        label="Email Address *"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        ref={emailRef}
      />
      <HeadingAndInput
        label="Password *"
        type="password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
      />
      <div className={styles.hintRow}>
        <button
          type="button"
          className={styles.linkBtn}
          onClick={() => switchMode("forgot")}
        >
          Forgot Password?
        </button>
      </div>
      {ErrorBlock}
      {info && !displayError && <div style={{ color: "#0a7" }}>{info}</div>}
      <Button
        label={loading ? "Logging in..." : "Log In"}
        width="100%"
        height="48px"
        borderRadius="10px"
        disabled={loading}
        onClick={onLogin}
        bgColor="linear-gradient(90deg, #A851C5 0%, #9333EA 100%)"
      />
    </form>
  );

  const SignupView = (
    <form className={styles.card} onSubmit={onSignup}>
      {HeaderTabs}
      <div className={styles.row2}>
        <HeadingAndInput
          label="First Name *"
          value={first}
          onChange={(e) => setFirst(e.target.value)}
          ref={firstRef}
        />
        <HeadingAndInput
          label="Last Name *"
          value={last}
          onChange={(e) => setLast(e.target.value)}
        />
      </div>
      <HeadingAndInput
        label="Email Address *"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <HeadingAndInput
        label="Password *"
        type="password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
      />
      {ErrorBlock}
      {info && !displayError && <div style={{ color: "#0a7" }}>{info}</div>}
      <Button
        label={loading ? "Signing up..." : "Sign Up"}
        width="100%"
        height="48px"
        borderRadius="10px"
        disabled={loading}
        onClick={onSignup}
        bgColor="linear-gradient(90deg, #A851C5 0%, #9333EA 100%)"
      />
    </form>
  );

  const ForgotView = (
    <form className={styles.card} onSubmit={onForgot}>
      {HeaderTabs}
      <HeadingAndInput
        label="Email Address *"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        ref={emailRef}
      />
      <div style={{ fontSize: 14, color: "#555", marginTop: -6 }}>
        We’ll email you a secure reset link.
      </div>
      {ErrorBlock}
      {info && !displayError && <div style={{ color: "#0a7" }}>{info}</div>}
      <Button
        label="Send Reset Link"
        width="100%"
        height="48px"
        borderRadius="10px"
        onClick={onForgot}
        bgColor="linear-gradient(90deg, #A851C5 0%, #9333EA 100%)"
      />
      <div className={styles.hintRow} style={{ justifyContent: "center" }}>
        <button
          type="button"
          className={styles.linkBtn}
          onClick={() => switchMode("login")}
        >
          Back to Log In
        </button>
      </div>
    </form>
  );

  const View =
    mode === "signup" ? SignupView : mode === "forgot" ? ForgotView : LoginView;

  return (
    <div
      className={styles.sheet}
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.stopPropagation()}
    >
      {View}
      <div className={styles.footer}>
        <button className={styles.close} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
