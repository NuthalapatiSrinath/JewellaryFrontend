import React from "react";
import styles from "./VisitUsSection.module.css";
import Button from "../../components/Button/Button"; // <- your dynamic Button
import { FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";

// if you have exact coords, set them here:
const LAT = 37.637; // demo coords — replace with real
const LNG = -122.394; // demo coords — replace with real
const PLACE_NAME = "Arra Jewels";
const ADDRESS_LINE =
  "1248 Harbor View Drive, Suite 410, Bayshore";

const VisitUsSection = () => {
  // Simple Google Maps embed (no API key needed)
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    `${PLACE_NAME} ${ADDRESS_LINE}`
  )}&hl=en&z=15&output=embed`;

  // Optional: link for directions
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${PLACE_NAME}, ${ADDRESS_LINE}`
  )}`;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Top row: store photo + info card + buttons */}
        <div className={styles.topRow}>
          <div className={styles.photoWrap}>
            <div className={styles.plate} aria-hidden="true" />
            <img
              className={styles.photo}
              src="/images/store.jpg"
              alt="Arra Jewels storefront"
            />
          </div>

          <div className={styles.infoCard}>
            <h3 className={styles.title}>Arra jewels</h3>
            <p className={styles.desc}>
              <strong>Street:</strong> 1248 Harbor View Drive, Suite 410
              <span className={styles.dot}>•</span> City / State / ZIP:
              Bayshore, CA 94001-1234 <span className={styles.dot}>•</span>{" "}
              County: Bayshore (Fictional County){" "}
              <span className={styles.dot}>•</span> Phone: +1-224-806-6786
              <span className={styles.dot}>•</span> Notes: Near Bayshore Pier
              (fictional).
            </p>

            <div className={styles.btnRow}>
              <Button
                label="WhatsApp"
                bgColor="transparent"
                borderColor="var(--Primary_Color)"
                textColor="var(--Primary_Color)"
                hoverBg="var(--Primary_Color)"
                hoverColor="var(--White_Color)"
                height="40px"
                padding="0 18px"
                borderRadius="10px"
                iconLeft={<FaWhatsapp />}
                onClick={() =>
                  window.open("https://wa.me/+1-224-806-6786", "_blank")
                }
              />

              <Button
                label="Book an Appointment"
                bgColor="var(--Primary_Color)"
                textColor="var(--White_Color)"
                hoverBg="#8b2f8b"
                height="40px"
                padding="0 18px"
                borderRadius="10px"
                onClick={() => alert("Open appointment modal")}
              />
            </div>
          </div>
        </div>

        {/* Bottom row: details card + Google map */}
        <div className={styles.mapRow}>
          <div className={styles.details}>
            <ul className={styles.meta}>
              <li>
                <span className={styles.metaKey}>Name:</span>
                <span className={styles.metaVal}>{PLACE_NAME}</span>
              </li>
              <li>
                <span className={styles.metaKey}>Street:</span>
                <span className={styles.metaVal}>{ADDRESS_LINE}</span>
              </li>
              <li>
                <span className={styles.metaKey}>County:</span>
                <span className={styles.metaVal}>
                  Bayshore (Fictional County)
                </span>
              </li>
              <li>
                <span className={styles.metaKey}>Phone:</span>
                <span className={styles.metaVal}>(555) 010-2345</span>
              </li>
              <li>
                <span className={styles.metaKey}>Notes:</span>
                <span className={styles.metaVal}>
                  Near Bayshore Pier (fictional).
                </span>
              </li>
            </ul>

            <Button
              label="Get Directions"
              bgColor="transparent"
              borderColor="var(--Primary_Color)"
              textColor="var(--Primary_Color)"
              hoverBg="var(--Primary_Color)"
              hoverColor="var(--White_Color)"
              height="40px"
              padding="0 18px"
              borderRadius="10px"
              iconLeft={<FaMapMarkerAlt />}
              onClick={() => window.open(directionsHref, "_blank")}
              style={{ width: "100%", marginTop: 16 }}
            />
          </div>

          <div className={styles.mapBox}>
            <iframe
              title="Google Map"
              src={mapSrc}
              className={styles.map}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisitUsSection;
