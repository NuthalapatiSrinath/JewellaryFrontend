import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./SelectionSection.module.css";

// Tab selector (small top pills)
import TabSelector from "../../components/TabSelector/TabSelector";

// pages
import DesignProgressFlow from "../DesignYourOwn/DesignProgressFlow";
import ReadyToShip from "../ReadyToShip/ReadyToShip";
import FooterPage from "../../pages/FooterPage/FooterPage";

export default function SelectionSection() {
  const navigate = useNavigate();
  const location = useLocation();

  // tab keys must match the path segment names you want to use
  const tabKeys = ["design", "ready"]; // index 0 => /.../design, index 1 => /.../ready
  const tabs = [{ label: "Design your own" }, { label: "Ready to ship" }];

  // Top tab (Design your own / Ready to ship)
  const [tabIndex, setTabIndex] = useState(0);

  // Controlled step state (unchanged)
  const [activeStep, setActiveStep] = useState(0);
  const [maxVisitedStep, setMaxVisitedStep] = useState(0);

  // sample product data (replace with real)
  const product = {
    id: "ring-001",
    title: "Solitaire Diamond Engagement Ring",
    subtitle: "1.00 ct · H color · VVS2 · Good clarity",
    price: "$6000",
    defaultColor: "gold",
    variants: {
      gold: "/images/ring-gold.jpg",
      white: "/images/ring-white.jpg",
      rose: "/images/ring-rose.jpg",
    },
  };

  // when Design flow requests step change we ensure maxVisitedStep increases
  const handleSetStep = (i) => {
    setActiveStep(i);
    setMaxVisitedStep((m) => Math.max(m, i));
  };

  // Helper: derive last segment (the tab) from the pathname
  const getLastPathSegment = (pathname) => {
    const parts = pathname.split("/").filter(Boolean); // remove empties
    if (parts.length === 0) return "";
    return parts[parts.length - 1].toLowerCase();
  };

  // Helper: compute base path (everything except the last segment if it is a known tab)
  const getBasePath = (pathname) => {
    const parts = pathname.split("/").filter(Boolean);
    if (!parts.length) return "/";
    const last = parts[parts.length - 1].toLowerCase();
    if (tabKeys.includes(last)) {
      // remove the last segment
      const baseParts = parts.slice(0, parts.length - 1);
      return "/" + baseParts.join("/");
    }
    return pathname; // pathname doesn't end with a tab segment, keep it as-is
  };

  // On mount / location change: set tabIndex based on the last path segment.
  useEffect(() => {
    const last = getLastPathSegment(location.pathname);
    const idx = tabKeys.indexOf(last);
    setTabIndex(idx === -1 ? 0 : idx); // default to 0 (design) when unknown
  }, [location.pathname]);

  // When user switches tabs: navigate to `${basePath}/${tabKey}`
  const handleTabChange = (newIndex) => {
    setTabIndex(newIndex);
    const base = getBasePath(location.pathname);
    const targetKey = tabKeys[newIndex] || tabKeys[0];
    // normalize: ensure a single leading slash and no double slashes
    const targetPath = `${base.replace(/\/$/, "")}/${targetKey}`;
    navigate(targetPath, { replace: false });
  };

  return (
    <>
      <section className={styles.page} aria-labelledby="selection-heading">
        {/* HERO: full-width image with right-side overlay text */}
        <div className={styles.upsidePage}>
          <div className={styles.hero}>
            <img
              src="/images/selectionheroimage.webp"
              alt="Exclusive Engagement Rings"
              className={styles.heroImg}
            />
            <div className={styles.heroOverlay} aria-hidden="true" />
            <div className={styles.heroText}>
              <h2 className={styles.heroTitle}>Exclusive Engagement Rings</h2>
              <p className={styles.heroSubtitle}>with customization</p>
            </div>
          </div>

          {/* small tabs above */}
          <div className={styles.topTabs}>
            <TabSelector
              tabs={tabs}
              activeIndex={tabIndex}
              onTabChange={handleTabChange}
            />
          </div>
        </div>

        {/* Content area: controlled Design flow or ReadyToShip page */}
        <div className={styles.contentArea}>
          {tabIndex === 0 ? (
            <DesignProgressFlow
              initialProduct={product}
              currentStep={activeStep}
              setCurrentStep={handleSetStep}
              maxVisitedStep={maxVisitedStep}
            />
          ) : (
            <ReadyToShip />
          )}
        </div>
      </section>
      <FooterPage />
    </>
  );
}
