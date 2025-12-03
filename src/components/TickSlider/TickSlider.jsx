// src/components/TickSlider/TickSlider.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./TickSlider.module.css";

/**
 * TickSlider
 *
 * Props:
 * - ticks: string[] (labels)
 * - // Single-select mode:
 *   selectedIndex: number (controlled) OR defaultIndex (uncontrolled)
 * - // Range mode:
 *   selectedRange: [minIndex, maxIndex] (controlled) OR defaultRange: [0, ticks.length-1] (uncontrolled)
 * - onChange:
 *   - single mode: onChange(index)
 *   - range mode: onChange([minIndex, maxIndex])
 * - infoText: optional tooltip text for info icon
 *
 * Behavior:
 * - If selectedRange / defaultRange provided (array), component enters range mode with two thumbs.
 * - Default behavior (no range props) is single-select with one thumb.
 * - Initializes to full span in range mode (0 .. last) when defaults aren't provided.
 */
export default function TickSlider({
  ticks = [],
  selectedIndex,
  defaultIndex = 0,
  selectedRange,
  defaultRange,
  onChange = () => {},
  className = "",
  infoText = "",
}) {
  const steps = Math.max(1, ticks.length - 1);

  const rangeMode = Array.isArray(selectedRange) || Array.isArray(defaultRange);

  // Controlled vs uncontrolled
  const isControlledSingle = typeof selectedIndex === "number";
  const isControlledRange = Array.isArray(selectedRange);

  // uncontrolled initial values
  const initialRange =
    defaultRange && defaultRange.length === 2
      ? defaultRange
      : [0, Math.max(0, ticks.length - 1)];

  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const [internalRange, setInternalRange] = useState(initialRange);

  // sync defaults when ticks change (uncontrolled)
  useEffect(() => {
    if (!isControlledSingle) setInternalIndex(defaultIndex);
    if (!isControlledRange) setInternalRange(initialRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticks.length]);

  // derived values
  const index = isControlledSingle ? selectedIndex : internalIndex;
  const range = isControlledRange ? selectedRange : internalRange;
  const [rangeMin, rangeMax] = rangeMode ? [range[0], range[1]] : [null, null];

  // pct for filled width (single => 0..pct; range => min..max)
  const pctSingle = useMemo(() => (index / steps) * 100, [index, steps]);
  const pctRangeLeft = useMemo(
    () => ((rangeMin ?? 0) / steps) * 100,
    [rangeMin, steps]
  );
  const pctRangeRight = useMemo(
    () => ((rangeMax ?? steps) / steps) * 100,
    [rangeMax, steps]
  );

  const inputRef = useRef(null);
  const inputRangeMinRef = useRef(null);
  const inputRangeMaxRef = useRef(null);

  // Single mode handlers
  function handleSingleChange(e) {
    const v = Number(e.target.value);
    if (!isControlledSingle) setInternalIndex(v);
    onChange(v);
  }

  // Range handlers (discrete indices)
  function setRangeMin(newMin) {
    const clamped = Math.max(0, Math.min(newMin, rangeMax - 1));
    if (!isControlledRange) setInternalRange([clamped, rangeMax]);
    onChange([clamped, rangeMax]);
  }
  function setRangeMax(newMax) {
    const clamped = Math.min(steps, Math.max(newMax, rangeMin + 1));
    if (!isControlledRange) setInternalRange([rangeMin, clamped]);
    onChange([rangeMin, clamped]);
  }

  // click on label button for single/range toggle behavior:
  function handleLabelClick(i) {
    if (!rangeMode) {
      if (!isControlledSingle) setInternalIndex(i);
      onChange(i);
      inputRef.current?.focus();
      return;
    }

    // range mode: clicking label toggles nearest thumb to that index
    const distToMin = Math.abs(i - rangeMin);
    const distToMax = Math.abs(i - rangeMax);
    if (distToMin <= distToMax) {
      // move min
      setRangeMin(i);
      inputRangeMinRef.current?.focus();
    } else {
      setRangeMax(i);
      inputRangeMaxRef.current?.focus();
    }
  }

  // handle track clicks: map to nearest index or nearest point inside range
  function handleTrackClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPct = clickX / rect.width;
    const nearest = Math.round(clickPct * steps);

    if (!rangeMode) {
      if (!isControlledSingle) setInternalIndex(nearest);
      onChange(nearest);
      inputRef.current?.focus();
      return;
    }

    // range mode: decide which thumb is closer, move it
    const distToMin = Math.abs(nearest - rangeMin);
    const distToMax = Math.abs(nearest - rangeMax);
    if (distToMin <= distToMax) {
      setRangeMin(nearest);
      inputRangeMinRef.current?.focus();
    } else {
      setRangeMax(nearest);
      inputRangeMaxRef.current?.focus();
    }
  }

  return (
    <div
      className={`${styles.wrapper} ${className}`}
      role="group"
      aria-label="Tick slider"
    >
      <div className={styles.labelsAbsolute}>
        {ticks.map((t, i) => {
          const leftPct = (i / steps) * 100;
          const styleLeft = { left: `${leftPct}%` };
          return (
            <button
              key={t + i}
              type="button"
              className={`${styles.labelBtn} ${
                (!rangeMode && i === index) ||
                (rangeMode && i >= rangeMin && i <= rangeMax)
                  ? styles.activeLabel
                  : ""
              }`}
              style={{
                ...styleLeft,
                transform:
                  i === 0 || i === ticks.length - 1
                    ? undefined
                    : "translateX(-50%)",
              }}
              onClick={() => handleLabelClick(i)}
              aria-pressed={
                (!rangeMode && i === index) ||
                (rangeMode && i >= rangeMin && i <= rangeMax)
              }
            >
              <span className={styles.labelText}>{t}</span>
            </button>
          );
        })}

        {infoText ? (
          <>
            <div
              className={styles.infoBtn}
              role="button"
              tabIndex={0}
              aria-label="More information"
              title={infoText}
            >
              i
            </div>
            <div className={styles.infoTooltip} role="tooltip">
              {infoText}
            </div>
          </>
        ) : null}
      </div>

      <div
        className={styles.trackWrap}
        onClick={handleTrackClick}
        role="presentation"
      >
        <div className={styles.rail} />
        {/* Filled area */}
        {!rangeMode ? (
          <>
            <div className={styles.filled} style={{ width: `${pctSingle}%` }} />
            <div
              className={styles.thumb}
              style={{ left: `${pctSingle}%`, transform: "translateX(-50%)" }}
            />
          </>
        ) : (
          <>
            <div
              className={styles.filled}
              style={{
                left: `${pctRangeLeft}%`,
                width: `${Math.max(0, pctRangeRight - pctRangeLeft)}%`,
              }}
            />
            <div
              className={styles.thumb}
              style={{
                left: `${pctRangeLeft}%`,
                transform: "translateX(-50%)",
              }}
            />
            <div
              className={styles.thumb}
              style={{
                left: `${pctRangeRight}%`,
                transform: "translateX(-50%)",
              }}
            />
          </>
        )}
      </div>

      {/* Native range inputs (invisible) */}
      {!rangeMode ? (
        <input
          ref={inputRef}
          className={styles.rangeInput}
          type="range"
          min={0}
          max={steps}
          step={1}
          value={index}
          onChange={(e) => handleSingleChange(e)}
          aria-label="Choose option"
        />
      ) : (
        <>
          <input
            ref={inputRangeMinRef}
            className={styles.rangeInput}
            type="range"
            min={0}
            max={steps}
            step={1}
            value={rangeMin}
            onChange={(e) => setRangeMin(Number(e.target.value))}
            aria-label="Minimum option"
          />
          <input
            ref={inputRangeMaxRef}
            className={styles.rangeInput}
            type="range"
            min={0}
            max={steps}
            step={1}
            value={rangeMax}
            onChange={(e) => setRangeMax(Number(e.target.value))}
            aria-label="Maximum option"
          />
        </>
      )}
    </div>
  );
}
