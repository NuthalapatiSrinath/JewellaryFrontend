import React, { useEffect, useState } from "react";
import Topbar from "../../pages/Topbar/Topbar";
import styles from "./DashboardLayout.module.css";
import { Outlet } from "react-router";

function DashboardLayout() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 16); // threshold to show shadow
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    // run once on mount
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={styles.DashboardLayout}>
      <div className={styles.LeftSection} />
      <div className={styles.RightSection}>
        {/* fixed wrapper — layout controls the fixed positioning and shadow */}
        <div
          className={`${styles.TopbarFixed} ${
            isScrolled ? styles.TopbarScrolled : ""
          }`}
        >
          <Topbar />
        </div>

        {/* Main content is padded to avoid being under the fixed topbar */}
        <main className={styles.Main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
