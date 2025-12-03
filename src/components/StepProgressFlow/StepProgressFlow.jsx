import React from "react";
import clsx from "clsx";
import styles from "./StepProgressFlow.module.css";

/**
 * StepProgressFlow (updated connectors + backward only navigation)
 *
 * Props:
 *  - activeStep: number (0..2)
 *  - onStepClick: (index) => void
 */
export default function StepProgressFlow({
  activeStep = 0,
  onStepClick = () => {},
}) {
  const steps = [
    { id: 0, label: "Choose Setting", icon: "/images/settings.svg" },
    { id: 1, label: "Choose Diamond", icon: "/images/diamond.svg" },
    { id: 2, label: "Get Ring", icon: "/images/ring.svg" },
  ];

  const handleClick = (i) => {
    // ✅ allow backward clicks only
    if (i <= activeStep) {
      onStepClick(i);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.progressBox} data-step={activeStep}>
        <div className={styles.stepsRow}>
          {steps.map((step, i) => {
            const isActive = i === activeStep;
            const isCompleted = i < activeStep;

            return (
              <React.Fragment key={step.id}>
                {/* Step item */}
                <div className={styles.stepItem}>
                  <div
                    className={clsx(styles.circle, {
                      [styles.active]: isActive,
                      [styles.completed]: isCompleted,
                    })}
                    onClick={() => handleClick(i)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (
                        (e.key === "Enter" || e.key === " ") &&
                        i <= activeStep
                      ) {
                        onStepClick(i);
                      }
                    }}
                    aria-label={step.label}
                  >
                    <img
                      src={step.icon}
                      alt={step.label}
                      className={styles.icon}
                    />
                    {isCompleted && (
                      <span className={styles.checkBadge}>✓</span>
                    )}
                  </div>

                  <div
                    className={clsx(styles.label, {
                      [styles.labelActive]: isActive,
                    })}
                  >
                    {step.label}
                  </div>
                </div>

                {/* Connector after step (render for all but last) */}
                {i < steps.length - 1 && (
                  <div className={styles.connectorWrap} aria-hidden="true">
                    <div
                      className={clsx(
                        styles.connectorTrack,
                        activeStep > i && styles.connectorFilled
                      )}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
