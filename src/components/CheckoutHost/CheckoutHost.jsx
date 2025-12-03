import React, { useEffect } from "react";
import styles from "./CheckoutHost.module.css";

/**
 * Props added:
 * - maxVisitedStep: highest step index the user has reached (inclusive)
 */
const CheckoutHost = ({
  steps = [],
  stepContents = [],
  initialStep = 0,
  onStepChange = () => {},
  currentStep,
  setCurrentStep,
  maxVisitedStep = 0,
}) => {
  const activeStep = currentStep ?? initialStep;

  useEffect(() => {
    onStepChange(activeStep);
  }, [activeStep, onStepChange]);

  const handleStepClick = (index) => {
    // allow going back freely; block clicking ahead of progress
    if (index <= maxVisitedStep) {
      setCurrentStep(index);
    }
    // else ignore click (you could add a shake animation here)
  };

  return (
    <div className={styles.container}>
      {/* Stepper */}
      <div className={styles.headerWrap}>
        <nav className={styles.header} aria-label="Checkout steps">
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            const isCompleted =
              index < activeStep || index <= maxVisitedStep - 1;
            return (
              <div key={step.id || index} className={styles.stepWrap}>
                <button
                  type="button"
                  className={`${styles.stepItem} ${
                    isActive
                      ? styles.activeStep
                      : isCompleted
                      ? styles.completedStep
                      : ""
                  }`}
                  onClick={() => handleStepClick(index)}
                >
                  <span className={styles.stepLabel}>{step.label}</span>
                </button>

                {index < steps.length - 1 && (
                  <span
                    className={`${styles.divider} ${
                      // dividers up to the furthest reached step turn blue
                      index < Math.max(activeStep, maxVisitedStep)
                        ? styles.activeDivider
                        : ""
                    }`}
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Body */}
      <div className={styles.body}>
        {stepContents[activeStep] || <p>No content for this step</p>}
      </div>
    </div>
  );
};

export default CheckoutHost;
