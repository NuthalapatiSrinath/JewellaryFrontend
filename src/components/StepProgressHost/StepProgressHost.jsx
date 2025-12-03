import React, { useMemo, useCallback } from "react";
import styles from "./StepProgressHost.module.css";
import clsx from "clsx";

/**
 * StepProgressHost
 *
 * Props:
 * - steps: [{ id, label, icon? }]
 * - currentStep: number
 * - setCurrentStep: fn(index)
 * - maxVisitedStep: number (prevents jumping ahead)
 *
 * Behavior:
 * - clicking a step calls setCurrentStep(idx) only if idx <= maxVisitedStep
 * - background gradient fill moves step by step
 */
export default function StepProgressHost({
  steps = [],
  currentStep = 0,
  setCurrentStep = () => {},
  maxVisitedStep = 0,
  className = "",
}) {
  const stepCount = steps.length;
  const percentFilled = useMemo(() => {
    if (stepCount <= 1) return 0;
    return (currentStep / (stepCount - 1)) * 100;
  }, [currentStep, stepCount]);

  const handleClickStep = useCallback(
    (i) => {
      if (i <= maxVisitedStep) setCurrentStep(i);
    },
    [maxVisitedStep, setCurrentStep]
  );

  const onKeyDown = (e) => {
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      if (e.key === "ArrowLeft") setCurrentStep(Math.max(0, currentStep - 1));
      if (e.key === "ArrowRight")
        setCurrentStep(Math.min(stepCount - 1, currentStep + 1));
      if (e.key === "Home") setCurrentStep(0);
      if (e.key === "End") setCurrentStep(stepCount - 1);
    }
  };

  return (
    <div
      className={clsx(styles.hostCard, className)}
      style={{
        background: `linear-gradient(90deg, rgba(245,235,245,1) 0%, rgba(245,235,245,${
          percentFilled / 100
        }) ${percentFilled}%, rgba(255,255,255,1) ${percentFilled}%)`,
      }}
    >
      <div
        className={styles.stepRow}
        role="tablist"
        aria-label="Progress steps"
        onKeyDown={onKeyDown}
      >
        {steps.map((s, i) => {
          const status =
            i < currentStep
              ? "complete"
              : i === currentStep
              ? "active"
              : "pending";
          const clickable = i <= maxVisitedStep;

          return (
            <div key={s.id ?? i} className={styles.stepItemWrapper}>
              {/* Circle button */}
              <button
                role="tab"
                aria-selected={status === "active"}
                tabIndex={status === "active" ? 0 : -1}
                className={clsx(
                  styles.stepButton,
                  status === "active" && styles.stepActive,
                  status === "complete" && styles.stepComplete,
                  !clickable && styles.stepDisabled
                )}
                onClick={() => handleClickStep(i)}
                title={s.label}
              >
                <span className={styles.iconWrap}>
                  {s.icon ? (
                    <span className={styles.iconInner}>{s.icon}</span>
                  ) : (
                    <span className={styles.iconInnerPlaceholder} />
                  )}

                  {status === "complete" && (
                    <span className={styles.checkBadge} aria-hidden="true">
                      ✓
                    </span>
                  )}
                </span>
              </button>

              {/* connector */}
              {i < steps.length - 1 && (
                <div className={styles.connectorWrap}>
                  <div
                    className={clsx(
                      styles.connectorTrack,
                      i < currentStep ? styles.connectorFilled : ""
                    )}
                  />
                </div>
              )}

              {/* label */}
              <div className={styles.stepLabel}>{s.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
