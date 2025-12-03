import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./RangeSlider.module.css";

/**
 * RangeSlider (live value bubble while dragging)
 * Props:
 * - min, max, step
 * - value (controlled) OR defaultValue (uncontrolled)
 * - onChange(value)
 * - showLabels (shows min/current/max row)
 * - id
 */
export default function RangeSlider({
  min = 0.05,
  max = 30,
  step = 0.01,
  value,
  defaultValue,
  onChange = () => {},
  showLabels = true,
  id,
}) {
  const controlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue ?? min);
  const current = controlled ? value : internal;
  const inputRef = useRef(null);
  const trackRef = useRef(null);

  // dragging state to show bubble
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!controlled && defaultValue !== undefined) setInternal(defaultValue);
  }, [defaultValue, controlled]);

  // percent across the track
  const percent = useMemo(() => {
    const clamped = Math.min(Math.max(Number(current), min), max);
    return ((clamped - min) / (max - min)) * 100 || 0;
  }, [current, min, max]);

  // update value (used by onInput & track clicks)
  function updateValue(newVal) {
    const rounded = Math.round((newVal - min) / step) * step + min;
    const v = Number(rounded.toFixed(2));
    if (!controlled) setInternal(v);
    onChange(v);
  }

  // onInput fires continuously while dragging in most browsers — use it for live updates
  function handleInput(e) {
    const v = Number(e.target.value);
    updateValue(v);
  }

  // onChange will also fire when pointer up; keep it for completeness
  function handleChange(e) {
    const v = Number(e.target.value);
    updateValue(v);
  }

  // clicking the track moves to that position
  function handleTrackClick(e) {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPct = clickX / rect.width;
    const raw = min + clickPct * (max - min);
    updateValue(raw);
    // focus input for keyboard access
    inputRef.current?.focus();
  }

  // pointer handlers for showing bubble
  function onPointerDown() {
    setDragging(true);
  }
  function onPointerUp() {
    setDragging(false);
  }

  // compute floating bubble left (clamp between 0 and 100)
  const bubbleLeft = `${Math.max(0, Math.min(100, percent))}%`;

  return (
    <div className={styles.RangeSlider}>
      <div className={styles.labelsRow}>
        {showLabels && <div className={styles.labelLeft}>Min Carat</div>}
        {showLabels && <div className={styles.labelRight}>Max Carat</div>}
      </div>

      <div
        className={styles.trackWrap}
        onClick={handleTrackClick}
        ref={trackRef}
        role="presentation"
      >
        <div className={styles.rail} />
        <div
          className={styles.filled}
          style={{ width: `${percent}%` }}
          aria-hidden="true"
        />

        {/* visual thumb */}
        <div
          className={styles.thumb}
          style={{ left: `${percent}%`, transform: `translateX(-50%)` }}
          aria-hidden="true"
        />

        {/* floating bubble above thumb (visible while dragging OR always if you want) */}
        <div
          className={`${styles.bubble} ${dragging ? styles.visible : ""}`}
          style={{ left: bubbleLeft }}
          aria-hidden="true"
        >
          {Number(current).toFixed(2)}
        </div>

        {/* native range input (invisible) - use onInput for live updates */}
        <input
          id={id}
          ref={inputRef}
          className={styles.inputRange}
          type="range"
          min={min}
          max={max}
          step={step}
          value={current}
          onInput={handleInput}
          onChange={handleChange}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          aria-label="Range slider"
        />
      </div>

      {showLabels && (
        <div className={styles.valueRow}>
          <span className={styles.minVal}>{min.toFixed(2)}</span>
          <span className={styles.currentVal}>
            {Number(current).toFixed(2)}
          </span>
          <span className={styles.maxVal}>{max.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
}
