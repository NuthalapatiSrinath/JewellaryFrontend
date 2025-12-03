import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./ImageGallery360.module.css";

/**
 * props:
 * - images: array of images (will be used for the 4-grid)
 * - frames: optional array of frame URLs for real 360 (if provided, will replace first cell image)
 */
export default function ImageGallery360({ images = [], frames = [] }) {
  const [frameIndex, setFrameIndex] = useState(0);
  const mainRef = useRef(null);

  // If frames provided: show frame-by-frame based on mouse X position
  const handleMoveFrames = useCallback(
    (e) => {
      if (!frames || frames.length === 0) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      // map x (0..1) to frame index
      const idx = Math.floor(x * (frames.length - 1));
      setFrameIndex(idx);
    },
    [frames]
  );

  // If no frames provided, use gentle tilt: store tilt angle
  const [tilt, setTilt] = useState(0);
  const handleTilt = useCallback(
    (e) => {
      if (frames && frames.length) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      setTilt((x - 0.5) * 30); // -15..+15 deg
    },
    [frames]
  );

  const handleLeave = useCallback(() => {
    if (frames && frames.length) return;
    setTilt(0);
  }, [frames]);

  // determine thumbnails (exactly 4 cells). If fewer, repeat last
  const thumbs = images.slice(0, 4);
  while (thumbs.length < 4) thumbs.push(images[images.length - 1] || "");

  return (
    <div className={styles.gallery} aria-hidden="false">
      {thumbs.map((img, i) => {
        const isFirst = i === 0;
        const style =
          isFirst && frames && frames.length
            ? undefined
            : { transform: isFirst ? `rotateY(${tilt}deg)` : undefined };

        return (
          <div
            key={i}
            ref={isFirst ? mainRef : null}
            className={`${styles.cell} ${isFirst ? styles.main : ""}`}
            onMouseMove={
              isFirst
                ? frames && frames.length
                  ? handleMoveFrames
                  : handleTilt
                : undefined
            }
            onMouseLeave={
              isFirst
                ? frames && frames.length
                  ? undefined
                  : handleLeave
                : undefined
            }
            style={style}
          >
            {isFirst && frames && frames.length ? (
              <img
                src={frames[frameIndex]}
                alt={`360 frame ${frameIndex + 1}`}
              />
            ) : (
              <img src={img} alt={`View ${i + 1}`} />
            )}

            {isFirst && (
              <div className={styles.overlayTip}>Tap to see in 360°</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
