// src/components/DoubleRangeSlider/DoubleRangeSlider.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import styles from "./DoubleRangeSlider.module.css";

/**
 * DoubleRangeSlider
 * - min, max, step
 * - valueMin, valueMax (controlled) OR defaultMin, defaultMax (uncontrolled)
 * - onChange({ min, max })
 *
 * Behavior:
 * - Initializes to full span (min..max) when default* or uncontrolled values aren't provided.
 * - Prevents thumbs from crossing; respects at least `step` gap.
 * - Supports keyboard arrows on the native inputs.
 */
export default function DoubleRangeSlider({
  min = 0,
  max = 20000,
  step = 50,
  valueMin,
  valueMax,
  defaultMin,
  defaultMax,
  onChange = () => {},
}) {
  const isControlled = valueMin !== undefined && valueMax !== undefined;

  // default to full span if caller didn't provide defaults
  const initialMin = defaultMin !== undefined ? defaultMin : min;
  const initialMax = defaultMax !== undefined ? defaultMax : max;

  const [internalMin, setInternalMin] = useState(initialMin);
  const [internalMax, setInternalMax] = useState(initialMax);

  // if controlled props change, keep internal in sync (safe no-op for controlled use)
  useEffect(() => {
    if (isControlled) return;
    setInternalMin(initialMin);
    setInternalMax(initialMax);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [min, max]);

  const curMin = isControlled ? valueMin : internalMin;
  const curMax = isControlled ? valueMax : internalMax;

  const inputMinRef = useRef(null);
  const inputMaxRef = useRef(null);

  // clamp helpers
  function clamp(v) {
    if (v < min) return min;
    if (v > max) return max;
    return v;
  }

  // ensure spacing (prevent crossing)
  function setMin(nextRaw) {
    let next = clamp(Number(nextRaw));
    const maxAllowed = curMax - step;
    if (next > maxAllowed) next = maxAllowed;
    if (!isControlled) setInternalMin(next);
    onChange({ min: next, max: curMax });
  }
  function setMax(nextRaw) {
    let next = clamp(Number(nextRaw));
    const minAllowed = curMin + step;
    if (next < minAllowed) next = minAllowed;
    if (!isControlled) setInternalMax(next);
    onChange({ min: curMin, max: next });
  }

  // percentages for rendering
  const pctMin = useMemo(
    () => ((curMin - min) / (max - min)) * 100,
    [curMin, min, max]
  );
  const pctMax = useMemo(
    () => ((curMax - min) / (max - min)) * 100,
    [curMax, min, max]
  );

  // keyboard handlers are handled by native input; we add step-based keyboard fallback via onKeyDown if desired.
  return (
    <div className={styles.wrapper}>
      <div className={styles.railWrap} aria-hidden>
        <div className={styles.rail} />
        <div
          className={styles.filled}
          style={{
            left: `${pctMin}%`,
            width: `${Math.max(0, pctMax - pctMin)}%`,
          }}
        />
        <div
          className={styles.thumb}
          style={{ left: `${pctMin}%`, transform: "translateX(-50%)" }}
          aria-hidden
        />
        <div
          className={styles.thumb}
          style={{ left: `${pctMax}%`, transform: "translateX(-50%)" }}
          aria-hidden
        />
      </div>

      {/* Transparent native inputs for accessibility and keyboard */}
      <input
        ref={inputMinRef}
        className={styles.rangeInput}
        type="range"
        min={min}
        max={max}
        step={step}
        value={curMin}
        onChange={(e) => setMin(e.target.value)}
        aria-label="Minimum value"
      />
      <input
        ref={inputMaxRef}
        className={styles.rangeInput}
        type="range"
        min={min}
        max={max}
        step={step}
        value={curMax}
        onChange={(e) => setMax(e.target.value)}
        aria-label="Maximum value"
      />
    </div>
  );
}
