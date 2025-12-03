import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./CheckoutHostPage.module.css";
import CheckoutHost from "../../components/CheckoutHost/CheckoutHost";

import CartStep from "../CartPage/CartPage";
import AddressStep from "../AddressPage/AddressPage";
import PaymentStep from "../PaymentPage/PaymentPage";

import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/modalSlice";
import FooterPage from "../FooterPage/FooterPage";

/* ---------------- Clean path mapping (no /event anywhere) ---------------- */

const PATHS = {
  CART: "/cart",
  ADDRESS: "/checkout",
  PAYMENT: "/payment",
};

const normalize = (p) => (p.endsWith("/") && p.length > 1 ? p.slice(0, -1) : p);

const pathToIndex = (pathname) => {
  const p = normalize(pathname);
  if (p === PATHS.PAYMENT) return 2;
  if (p === PATHS.ADDRESS) return 1;
  if (p === PATHS.CART) return 0;
  return 0; // default to cart
};

const indexToPath = (i) =>
  i === 2 ? PATHS.PAYMENT : i === 1 ? PATHS.ADDRESS : PATHS.CART;

/* ------------------------------------------------------------------------ */

const CheckoutHostPage = ({ initialStep }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // derive initial step (from prop or URL)
  const startIndex = useMemo(() => {
    if (typeof initialStep === "number") return initialStep;
    return pathToIndex(location.pathname);
  }, [initialStep, location.pathname]);

  const [currentStep, setCurrentStep] = useState(startIndex);
  const [maxVisitedStep, setMaxVisitedStep] = useState(startIndex);

  // listen for auth success
  useEffect(() => {
    const handler = () => setIsLoggedIn(true);
    window.addEventListener("auth:success", handler);
    return () => window.removeEventListener("auth:success", handler);
  }, []);

  // scroll top when step changes
  useEffect(() => {
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  }, [currentStep]);

  // update URL to match step
  useEffect(() => {
    const expected = indexToPath(currentStep);
    const here = normalize(location.pathname);
    if (here !== expected) navigate(expected, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  // handle browser back/forward
  useEffect(() => {
    const idx = pathToIndex(location.pathname);
    if (idx !== currentStep) setCurrentStep(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // navigation
  const goNext = () => {
    setCurrentStep((prev) => {
      const next = Math.min(prev + 1, 2);
      setMaxVisitedStep((m) => Math.max(m, next));
      return next;
    });
  };

  const goBack = () => setCurrentStep((p) => Math.max(p - 1, 0));

  const steps = [
    { id: "cart", label: "Cart" },
    { id: "checkout", label: "CheckOut" },
    { id: "payment", label: "Payments" },
  ];

  const stepContents = [
    <CartStep key="cart" onNext={goNext} />,
    <AddressStep
      key="checkout"
      isLoggedIn={isLoggedIn}
      onBack={goBack}
      onNext={() => {
        if (isLoggedIn) goNext();
        else dispatch(openModal({ type: "AUTH" }));
      }}
      onLoginRequest={() => dispatch(openModal({ type: "AUTH" }))}
    />,
    <PaymentStep key="payment" onBack={goBack} />,
  ];

  return (
    <>
      <div className={styles.pageWrapper}>
        <div className={styles.hostWrapper}>
          <CheckoutHost
            steps={steps}
            stepContents={stepContents}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            maxVisitedStep={maxVisitedStep}
          />
        </div>
      </div>
      <FooterPage/>
    </>
  );
};

export default CheckoutHostPage;
