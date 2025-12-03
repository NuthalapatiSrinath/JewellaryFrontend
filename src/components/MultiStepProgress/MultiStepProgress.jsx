// MultiStepProgress.jsx
import React, { useMemo, useState, useCallback } from "react";
import styles from "./MultiStepProgress.module.css";

/**
 * Props:
 * - steps: [{ key, label, icon?: JSX, component: JSX, substages?: string[] }]
 *    - icon optional: any JSX (svg)
 *    - substages optional: array of strings for the first step (displayed as dots)
 *
 * Example usage provided after component.
 */
export default function MultiStepProgress({ steps = [] }) {
  const [currentStep, setCurrentStep] = useState(0);
  // optionally track substages for the first step (index 0)
  const firstStepSubcount = steps?.[0]?.substages?.length ?? 0;
  const [subIndex, setSubIndex] = useState(0);

  // helpers: derived values
  const lastIndex = Math.max(0, (steps.length || 1) - 1);

  const isDone = (index) => index < currentStep;
  const isActive = (index) => index === currentStep;

  const goToStep = useCallback(
    (index) => {
      if (index < 0 || index > lastIndex) return;
      // only allow jump back to completed steps or forward to next immediate step
      // you can relax rules if you want free navigation
      if (index <= currentStep + 1) {
        setCurrentStep(index);
        if (index !== 0) setSubIndex(0);
      }
    },
    [currentStep, lastIndex]
  );

  const goNext = useCallback(() => {
    // if in first step and there are substages, progress substages first
    if (currentStep === 0 && firstStepSubcount > 0) {
      if (subIndex < firstStepSubcount - 1) {
        setSubIndex((s) => s + 1);
        return;
      }
      // completed sub-stages -> next step
    }
    setCurrentStep((s) => Math.min(lastIndex, s + 1));
    setSubIndex(0);
  }, [currentStep, firstStepSubcount, subIndex, lastIndex]);

  const goPrev = useCallback(() => {
    if (currentStep === 0 && subIndex > 0) {
      setSubIndex((s) => Math.max(0, s - 1));
      return;
    }
    setCurrentStep((s) => Math.max(0, s - 1));
    setSubIndex(0);
  }, [currentStep, subIndex]);

  // invoked by the diamond list when a diamond is selected — immediately move to next step
  const handleSelectDiamond = useCallback(
    (payload) => {
      // you could persist selection in a ref or event; here we just advance step
      const diamondStepIndex = steps.findIndex((st) =>
        /diamond/i.test(String(st.key || st.label))
      );
      const nextIndex =
        diamondStepIndex >= 0 ? diamondStepIndex + 1 : currentStep + 1;
      setCurrentStep((_) => Math.min(lastIndex, nextIndex));
      setSubIndex(0);
      // optionally expose payload via custom event so other components can consume
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("multistep:selectDiamond", { detail: payload })
        );
      }
    },
    [steps, lastIndex, currentStep]
  );

  // render top progress bar with icons
  const percent =
    steps.length > 1 ? (currentStep / Math.max(1, steps.length - 1)) * 100 : 0;

  return (
    <div className={styles.container}>
      <div className={styles.progressWrap}>
        <div className={styles.progressCard}>
          <div className={styles.progressRow}>
            {steps.map((s, idx) => {
              const done = isDone(idx);
              const active = isActive(idx);
              return (
                <div key={s.key || s.label || idx} className={styles.stepCell}>
                  <div
                    className={`${styles.iconWrap} ${
                      done ? styles.doneIconWrap : ""
                    } ${active ? styles.activeIconWrap : ""}`}
                    aria-hidden
                  >
                    <div className={styles.iconCircle}>
                      {s.icon ? (
                        s.icon
                      ) : (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="1.2"
                          />
                        </svg>
                      )}
                    </div>
                  </div>

                  <div className={styles.stepLabel}>{s.label}</div>
                </div>
              );
            })}
          </div>

          {/* progress bar line */}
          <div className={styles.progressLineWrap} aria-hidden>
            <div className={styles.progressLineBg} />
            <div
              className={styles.progressLineFill}
              style={{ width: `${percent}%` }}
            />
            {/* If first step has substages, show small dots along the first segment */}
            {firstStepSubcount > 1 && (
              <div className={styles.substageRow} aria-hidden>
                {Array.from({ length: firstStepSubcount }).map((_, i) => {
                  const filled = currentStep > 0 ? true : i <= subIndex;
                  return (
                    <span
                      key={i}
                      className={`${styles.substageDot} ${
                        filled ? styles.substageDotActive : ""
                      }`}
                      style={{
                        left: `${
                          (i / Math.max(1, firstStepSubcount - 1)) * 18
                        }%`,
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Current step content area */}
      <div className={styles.contentArea}>
        {steps.map((s, idx) => {
          if (idx !== currentStep) return null;
          const StepComponent = s.component;
          // render as function or JSX — support both
          return (
            <div key={s.key || s.label || idx} className={styles.stepContent}>
              {typeof StepComponent === "function" ? (
                <StepComponent
                  onNext={goNext}
                  onPrev={goPrev}
                  goToStep={goToStep}
                  onSelectDiamond={handleSelectDiamond}
                  currentSubIndex={subIndex}
                />
              ) : (
                StepComponent
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
