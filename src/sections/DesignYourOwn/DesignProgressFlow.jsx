import React, { useState, useEffect } from "react";
import ChooseSetting from "./ChooseSetting";
import ProductDetailForSetting from "./ProductDetailforSetting/ProductDetailforSetting";
import DiamondFinder from "../DiamondFinder/DiamondFinder";
import GetRing from "./GetRing";
import StepProgressFlow from "../../components/StepProgressFlow/StepProgressFlow"; // <-- new component
import styles from "./DesignProgressFlow.module.css"; // optional page-level styles

/**
 * DesignProgressFlow
 * - Original flow logic preserved (no changes).
 * - Uses StepProgressFlow for top progress UI.
 */
export default function DesignProgressFlow() {
  const [activeStep, setActiveStep] = useState(0); // 0 = choose setting, 1 = diamond, 2 = get ring
  const [chooseSubView, setChooseSubView] = useState("list"); // "list" | "detail"
  const [selectedSettingProduct, setSelectedSettingProduct] = useState(null);
  const [selectedDiamond, setSelectedDiamond] = useState(null);

  // Called by ChooseSetting when a product card is clicked (in-flow)
  const handleChooseCardClick = (product) => {
    setSelectedSettingProduct(product);
    setChooseSubView("detail");
  };

  // Called by ProductDetailForSetting -> "Back To Setting" (in-flow)
  const handleDetailBack = () => {
    setChooseSubView("list");
    setSelectedSettingProduct(null);
  };

  // Called by ProductDetailForSetting -> when "Select This Setting" is clicked (in-flow)
  const handleProceedFromSetting = (selection = {}) => {
    setSelectedSettingProduct((prev) => ({
      ...(prev || {}),
      settingSelection: selection,
    }));
    setActiveStep(1); // move to Diamond Finder
    setChooseSubView("list");
  };

  // Listen for the choosetting:selected event (fired by SelectSettingPanel or ChooseSetting)
  // and advance the flow to the Diamond Finder step. This supports the event-based integration.
  useEffect(() => {
    const handler = (e) => {
      const { product, selection } = e?.detail || {};
      if (product) {
        setSelectedSettingProduct({
          ...(product || {}),
          settingSelection: selection || {},
        });
      }
      setActiveStep(1); // move to Diamond Finder
      setChooseSubView("list"); // normalize subview
    };
    window.addEventListener("choosetting:selected", handler);
    return () => window.removeEventListener("choosetting:selected", handler);
  }, []);

  // Called by DiamondFinder when a diamond is chosen
  const handleSelectDiamond = (diamond) => {
    setSelectedDiamond(diamond);
    setActiveStep(2); // move to Get Ring
  };

  // optional: back from diamond to choose setting
  const handleBackToSetting = () => {
    setActiveStep(0);
    setChooseSubView("list");
  };

  // --- Navigation guard logic (allow back always; allow forward only if prerequisite completed) ---
  const canGoToStep = (targetStep) => {
    if (targetStep === activeStep) return true;
    if (targetStep < activeStep) return true; // always allow going back
    // forward navigation: only allow if prerequisites satisfied
    if (targetStep === 1) {
      // permit going to "Choose Diamond" only when a setting is selected
      return !!selectedSettingProduct;
    }
    if (targetStep === 2) {
      // permit going to "Get Ring" only when a diamond has been selected
      return !!selectedDiamond;
    }
    return false;
  };

  // Called by UI component when step circle is clicked.
  // We keep navigation rules here, exactly like earlier.
  const handleStepClick = (targetStep) => {
    if (!canGoToStep(targetStep)) {
      // blocked: do nothing
      return;
    }
    if (targetStep === 0) {
      setActiveStep(0);
      setChooseSubView("list");
      return;
    }
    setActiveStep(targetStep);
  };

  // Helper - compute which steps are completed (used by CSS/markup)
  const isStepCompleted = (i) => {
    if (i === 0) return !!selectedSettingProduct;
    if (i === 1) return !!selectedDiamond;
    return false;
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        {/* <h1 className={styles.mainTitle}>Design Your Own</h1> */}

        {/* ---------- Progress UI (now extracted into StepProgressFlow) ---------- */}
        <StepProgressFlow
          activeStep={activeStep}
          onStepClick={handleStepClick}
        />
      </div>

      <div className={styles.content}>
        {activeStep === 0 && (
          <div className={styles.chooseContainer}>
            {chooseSubView === "list" ? (
              // Pass onCardClick so the ChooseSetting component will open the inline detail
              <ChooseSetting onCardClick={handleChooseCardClick} />
            ) : (
              // Render product detail inline and wire back/proceed handlers
              <ProductDetailForSetting
                product={selectedSettingProduct}
                onBack={handleDetailBack}
                onProceed={handleProceedFromSetting}
              />
            )}
          </div>
        )}

        {activeStep === 1 && (
          <div className={styles.diamondContainer}>
            <DiamondFinder
              onSelectDiamond={(diamond) => {
                handleSelectDiamond(diamond);
              }}
              onBackToSetting={handleBackToSetting}
            />
          </div>
        )}

        {activeStep === 2 && (
          <div className={styles.getRingContainer}>
            <GetRing
              product={selectedSettingProduct || undefined}
              diamond={selectedDiamond || undefined}
            />
          </div>
        )}
      </div>
    </div>
  );
}
