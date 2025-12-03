import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./AdvancedFilter.module.css";
import { FiInfo } from "react-icons/fi";

/**
 * AdvancedFilter
 *
 * Props:
 * - title: string
 * - variant: "range-filled" | "range-ticks" | "select"
 * - info: string (optional tooltip/hover text)
 *
 * For variant "range-filled":
 * - min, max, step (numbers)
 * - value: [minVal, maxVal]
 * - onChange: (value) => {}
 *
 * For variant "range-ticks":
 * - ticks: array of labels (e.g. ["G","F","E","D"])
 * - value: [lowIndex, highIndex] (indexes into ticks)
 * - onChange: (indexes) => {}
 *
 * For variant "select":
 * - options: [{label, value}]
 * - value: selectedValue
 * - onChange: (val) => {}
 *
 * If onChange is not provided the component manages state internally.
 */

function Info({ text }) {
  const [visible, setVisible] = useState(false);
  return (
    <div
      className={styles.infoWrap}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <button className={styles.infoBtn} aria-label="info">
        <FiInfo />
      </button>
      <div
        className={`${styles.tooltip} ${visible ? styles.tooltipVisible : ""}`}
      >
        <div className={styles.tooltipInner}>{text}</div>
        <div className={styles.tooltipArrow} />
      </div>
    </div>
  );
}

/* ---------- Range Filled (continuous double slider) ---------- */
function RangeFilled({
  min = 0,
  max = 100,
  step = 1,
  value = [min, max],
  onChange,
}) {
  const [local, setLocal] = useState(value);
  const containerRef = useRef(null);

  // keep local in sync if parent changes
  useEffect(() => setLocal(value), [value]);

  const percent = (v) => ((v - min) / (max - min)) * 100;

  // compute style for filled part
  const leftPct = percent(local[0]);
  const rightPct = percent(local[1]);

  const handleThumbChange = (index, raw) => {
    // raw is number from input range
    const v = Math.min(Math.max(raw, min), max);
    const next = [...local];
    if (index === 0) {
      // ensure not crossing
      next[0] = Math.min(v, next[1] - step);
    } else {
      next[1] = Math.max(v, next[0] + step);
    }
    setLocal(next);
    onChange?.(next);
  };

  return (
    <div className={styles.rangeFilledWrap}>
      <div className={styles.trackWrap} ref={containerRef}>
        {/* background track */}
        <div className={styles.track} />
        {/* filled track between handles */}
        <div
          className={styles.filled}
          style={{
            left: `${leftPct}%`,
            width: `${Math.max(0, rightPct - leftPct)}%`,
          }}
        />
        {/* two native ranges stacked */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={local[0]}
          onChange={(e) => handleThumbChange(0, Number(e.target.value))}
          className={`${styles.rangeInput} ${styles.low}`}
          aria-label="min"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={local[1]}
          onChange={(e) => handleThumbChange(1, Number(e.target.value))}
          className={`${styles.rangeInput} ${styles.high}`}
          aria-label="max"
        />
        {/* circular handles visuals (positioned with CSS using percent) */}
        <div
          className={styles.handleMarker}
          style={{ left: `${leftPct}%`, transform: "translate(-50%,-50%)" }}
        />
        <div
          className={styles.handleMarker}
          style={{ left: `${rightPct}%`, transform: "translate(-50%,-50%)" }}
        />
      </div>

      <div className={styles.rangeValues}>
        <div className={styles.rangeValue}>
          ${Number(local[0]).toLocaleString()}
        </div>
        <div className={styles.rangeValue}>
          ${Number(local[1]).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

/* ---------- Range Ticks (discrete positions) ---------- */
function RangeTicks({ ticks = [], value = [0, ticks.length - 1], onChange }) {
  // value are indexes into ticks
  const [local, setLocal] = useState(value);
  useEffect(() => setLocal(value), [value]);

  const trackRef = useRef(null);

  // map index to percent across track (0..100)
  const idxToPct = (i) =>
    ticks.length === 1 ? 50 : (i / (ticks.length - 1)) * 100;

  // when dragging thumbs, we want to compute nearest tick
  const moveThumb = (which, clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    const rel = (clientX - rect.left) / rect.width;
    const pct = Math.min(1, Math.max(0, rel));
    const rawIndex = pct * (ticks.length - 1);
    const nearest = Math.round(rawIndex);
    const next = [...local];
    if (which === 0) {
      next[0] = Math.min(nearest, next[1]);
    } else {
      next[1] = Math.max(nearest, next[0]);
    }
    setLocal(next);
    onChange?.(next);
  };

  // pointer handlers
  const onThumbPointerDown = (which, e) => {
    e.preventDefault();
    const move = (ev) =>
      moveThumb(which, ev.clientX || ev.touches?.[0]?.clientX);
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);
  };

  return (
    <div className={styles.rangeTicksWrap}>
      <div className={styles.ticksTrack} ref={trackRef}>
        <div className={styles.ticksBar} />
        {/* active segments between low and high */}
        <div
          className={styles.ticksActive}
          style={{
            left: `${idxToPct(local[0])}%`,
            width: `${Math.max(0, idxToPct(local[1]) - idxToPct(local[0]))}%`,
          }}
        />
        {/* tick markers */}
        {ticks.map((t, i) => (
          <div
            key={i}
            className={styles.tickMarker}
            style={{ left: `${idxToPct(i)}%`, transform: "translateX(-50%)" }}
          />
        ))}

        {/* draggable handles */}
        <div
          className={styles.tickHandle}
          style={{ left: `${idxToPct(local[0])}%` }}
          onPointerDown={(e) => onThumbPointerDown(0, e)}
          onTouchStart={(e) => onThumbPointerDown(0, e)}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={ticks.length - 1}
          aria-valuenow={local[0]}
        />
        <div
          className={styles.tickHandle}
          style={{ left: `${idxToPct(local[1])}%` }}
          onPointerDown={(e) => onThumbPointerDown(1, e)}
          onTouchStart={(e) => onThumbPointerDown(1, e)}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={ticks.length - 1}
          aria-valuenow={local[1]}
        />
      </div>

      <div className={styles.ticksLabels}>
        {ticks.map((t, i) => (
          <div
            key={i}
            className={styles.tickLabel}
            style={{ width: `${100 / ticks.length}%` }}
          >
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Select variant ---------- */
function FancySelect({ options = [], value: parentValue, onChange }) {
  const [local, setLocal] = useState(
    parentValue ?? (options[0] && options[0].value)
  );
  useEffect(() => setLocal(parentValue), [parentValue]);

  return (
    <div className={styles.selectWrap}>
      <select
        className={styles.fancySelect}
        value={local}
        onChange={(e) => {
          setLocal(e.target.value);
          onChange?.(e.target.value);
        }}
      >
        {options.map((o) => (
          <option key={o.value ?? o.label} value={o.value ?? o.label}>
            {o.label}
          </option>
        ))}
      </select>
      <div className={styles.selectArrow}>▾</div>
    </div>
  );
}

/* ---------- Main exported component ---------- */
export default function AdvancedFilter(props) {
  const {
    title,
    variant = "range-filled",
    info,
    // range props
    min,
    max,
    step,
    value,
    onChange,
    // ticks props
    ticks,
    // select props
    options,
  } = props;

  return (
    <div className={styles.advFilterCard}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        {info ? <Info text={info} /> : null}
      </div>

      <div className={styles.body}>
        {variant === "range-filled" && (
          <RangeFilled
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
          />
        )}

        {variant === "range-ticks" && (
          <RangeTicks ticks={ticks} value={value} onChange={onChange} />
        )}

        {variant === "select" && (
          <FancySelect options={options} value={value} onChange={onChange} />
        )}
      </div>
    </div>
  );
}

/* ---------- Example usage (copy to the page where you render filters) ----------
<AdvancedFilter
  title="PRICE"
  variant="range-filled"
  info="Price range for ring and loose stones"
  min={100}
  max={200000}
  step={50}
  value={[19587.95, 144167.57]}
  onChange={(v)=> console.log("price", v)} // receives [min,max]
/>

<AdvancedFilter
  title="COLOR"
  variant="range-ticks"
  info="Choose color grades"
  ticks={["G","F","E","D"]}
  value={[0,2]} // indexes (G..E)
  onChange={(idxs)=> console.log("color idxs", idxs)}
/>

<AdvancedFilter
  title="CERTIFIED BY"
  variant="select"
  info="Choose certificate lab"
  options={[{label:"All",value:"all"},{label:"GIA",value:"gia"},{label:"IGI",value:"igi"}]}
  value={"all"}
  onChange={(v)=> console.log("cert", v)}
/>
----------------------------------------------------------------------- */
